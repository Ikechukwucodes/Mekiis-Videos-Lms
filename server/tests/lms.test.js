import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';
import { connectDB, disconnectDB } from '../src/config/db.js';
import { User } from '../src/models/User.js';
import { Course } from '../src/models/Course.js';
import { Module } from '../src/models/Module.js';
import { Lesson } from '../src/models/Lesson.js';
import { Enrollment } from '../src/models/Enrollment.js';
import { Progress } from '../src/models/Progress.js';

describe('LMS Integration Test Suite', () => {
  let studentToken = '';
  let studentId = '';
  let adminToken = '';
  let adminId = '';
  let testCourseId = '';
  let testModuleId = '';
  let testLessonId = '';
  let testLesson2Id = '';

  before(async () => {
    await connectDB();
    await Promise.all([
      User.deleteMany({}),
      Course.deleteMany({}),
      Module.deleteMany({}),
      Lesson.deleteMany({}),
      Enrollment.deleteMany({}),
      Progress.deleteMany({})
    ]);
  });

  after(async () => {
    await disconnectDB();
  });

  // 1. Authentication
  describe('Authentication & User Registration', () => {
    test('POST /api/auth/register creates initial admin user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Super Admin',
          email: 'admin@test.com',
          password: 'Password123!',
          role: 'ADMIN'
        });

      assert.equal(res.status, 201);
      assert.equal(res.body.success, true);
      assert.equal(res.body.data.user.role, 'ADMIN');
      assert.ok(res.body.data.token);
      adminToken = res.body.data.token;
      adminId = res.body.data.user.id;
    });

    test('POST /api/auth/register creates student user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Jane Student',
          email: 'student@test.com',
          password: 'Password123!',
          role: 'STUDENT'
        });

      assert.equal(res.status, 201);
      assert.equal(res.body.success, true);
      assert.equal(res.body.data.user.role, 'STUDENT');
      assert.ok(res.body.data.token);
      studentToken = res.body.data.token;
      studentId = res.body.data.user.id;
    });

    test('POST /api/auth/register rejects duplicate email with 409 Conflict', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Jane Duplicate',
          email: 'student@test.com',
          password: 'Password123!'
        });

      assert.equal(res.status, 409);
      assert.equal(res.body.success, false);
    });

    test('POST /api/auth/login rejects incorrect password with 401', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'student@test.com',
          password: 'WrongPassword!'
        });

      assert.equal(res.status, 401);
      assert.equal(res.body.success, false);
    });

    test('POST /api/auth/login succeeds with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'student@test.com',
          password: 'Password123!'
        });

      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.ok(res.body.data.token);
    });

    test('GET /api/auth/me returns current user profile with valid Bearer token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${studentToken}`);

      assert.equal(res.status, 200);
      assert.equal(res.body.data.user.email, 'student@test.com');
    });

    test('GET /api/auth/me fails with 401 when token is missing', async () => {
      const res = await request(app).get('/api/auth/me');
      assert.equal(res.status, 401);
    });
  });

  // 2. Role-Based Access Control
  describe('Authorization & RBAC Restrictions', () => {
    test('Student token CANNOT create course (403 Forbidden)', async () => {
      const res = await request(app)
        .post('/api/courses')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          title: 'Unauthorized Course',
          description: 'Should fail',
          category: 'Web Development'
        });

      assert.equal(res.status, 403);
      assert.equal(res.body.success, false);
    });

    test('Admin token CAN create course (201 Created)', async () => {
      const res = await request(app)
        .post('/api/courses')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Node.js Mastery Course',
          description: 'A comprehensive guide to building APIs',
          category: 'Backend Architecture',
          level: 'Intermediate',
          instructor: 'Super Admin',
          published: false
        });

      assert.equal(res.status, 201);
      assert.equal(res.body.success, true);
      assert.ok(res.body.data.course._id);
      assert.equal(res.body.data.course.slug, 'nodejs-mastery-course');
      testCourseId = res.body.data.course._id;
    });
  });

  // 3. Modules & Lessons Management
  describe('Curriculum Architecture (Modules & Lessons)', () => {
    test('Admin creates module under course', async () => {
      const res = await request(app)
        .post(`/api/courses/${testCourseId}/modules`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Module 1 — Fundamentals',
          description: 'Core concepts'
        });

      assert.equal(res.status, 201);
      assert.ok(res.body.data.module._id);
      testModuleId = res.body.data.module._id;
    });

    test('Admin creates lesson with YouTube video under module', async () => {
      const res = await request(app)
        .post(`/api/modules/${testModuleId}/lessons`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Lesson 1 — Getting Started',
          description: 'Introduction video',
          contentType: 'video',
          videoUrl: 'https://www.youtube.com/watch?v=W6NZfCO5SIk',
          duration: 600,
          published: true
        });

      assert.equal(res.status, 201);
      assert.ok(res.body.data.lesson._id);
      assert.ok(res.body.data.lesson.embedUrl.includes('youtube-nocookie.com/embed/W6NZfCO5SIk'));
      testLessonId = res.body.data.lesson._id;
    });

    test('Admin creates second lesson with Vimeo video under module', async () => {
      const res = await request(app)
        .post(`/api/modules/${testModuleId}/lessons`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Lesson 2 — Advanced Variables',
          description: 'Deep dive into scoping and closures',
          contentType: 'video',
          videoUrl: 'https://vimeo.com/76979871',
          duration: 900,
          order: 2,
          published: true
        });

      assert.equal(res.status, 201);
      assert.ok(res.body.data.lesson._id);
      assert.ok(res.body.data.lesson.embedUrl.includes('player.vimeo.com/video/76979871'));
      testLesson2Id = res.body.data.lesson._id;
    });

    test('Admin publishes the course', async () => {
      const res = await request(app)
        .patch(`/api/courses/${testCourseId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ published: true });

      assert.equal(res.status, 200);
      assert.equal(res.body.data.course.published, true);
    });

    test('Public catalog lists the published course', async () => {
      const res = await request(app).get('/api/courses');
      assert.equal(res.status, 200);
      assert.ok(res.body.data.courses.some((c) => c._id.toString() === testCourseId));
    });
  });

  // 4. Enrollment & Progress Engine
  describe('Enrollment and Learning Progress Engine', () => {
    test('Unenrolled student CANNOT access lesson content (403 Forbidden)', async () => {
      const res = await request(app)
        .get(`/api/lessons/${testLessonId}`)
        .set('Authorization', `Bearer ${studentToken}`);

      assert.equal(res.status, 403);
      assert.equal(res.body.success, false);
    });

    test('Unenrolled student CANNOT complete lesson (403 Forbidden)', async () => {
      const res = await request(app)
        .post(`/api/lessons/${testLessonId}/complete`)
        .set('Authorization', `Bearer ${studentToken}`);

      assert.equal(res.status, 403);
      assert.equal(res.body.success, false);
    });

    test('Student enrolls in course (201 Created)', async () => {
      const res = await request(app)
        .post(`/api/courses/${testCourseId}/enroll`)
        .set('Authorization', `Bearer ${studentToken}`);

      assert.equal(res.status, 201);
      assert.equal(res.body.success, true);
      assert.equal(res.body.data.enrollment.status, 'active');
      assert.equal(res.body.data.progress.completionPercentage, 0);
    });

    test('Student cannot re-enroll in the same course (409 Conflict)', async () => {
      const res = await request(app)
        .post(`/api/courses/${testCourseId}/enroll`)
        .set('Authorization', `Bearer ${studentToken}`);

      assert.equal(res.status, 409);
      assert.equal(res.body.success, false);
    });

    test('Student can access lesson content after enrollment', async () => {
      const res = await request(app)
        .get(`/api/lessons/${testLessonId}`)
        .set('Authorization', `Bearer ${studentToken}`);

      assert.equal(res.status, 200);
      assert.equal(res.body.data.lesson._id.toString(), testLessonId);
      assert.equal(res.body.data.lesson.videoData.provider, 'youtube');
    });

    test('Student completes Lesson 1 -> updates completion to 50% and sets next lesson pointer', async () => {
      const res = await request(app)
        .post(`/api/lessons/${testLessonId}/complete`)
        .set('Authorization', `Bearer ${studentToken}`);

      assert.equal(res.status, 200);
      assert.equal(res.body.data.completed, false); // 1 of 2 lessons completed
      assert.equal(res.body.data.completionPercentage, 50);
      assert.ok(res.body.data.progress.completedLessons.includes(testLessonId));
      assert.equal(res.body.data.progress.currentLessonId.toString(), testLesson2Id);
    });

    test('Student completes Lesson 2 -> reaches 100% completion and marks course completed', async () => {
      const res = await request(app)
        .post(`/api/lessons/${testLesson2Id}/complete`)
        .set('Authorization', `Bearer ${studentToken}`);

      assert.equal(res.status, 200);
      assert.equal(res.body.data.completed, true);
      assert.equal(res.body.data.completionPercentage, 100);
      assert.ok(res.body.data.progress.completedLessons.includes(testLesson2Id));
    });

    test('Student dashboard stats show completed course', async () => {
      const res = await request(app)
        .get('/api/me/stats')
        .set('Authorization', `Bearer ${studentToken}`);

      assert.equal(res.status, 200);
      assert.equal(res.body.data.stats.totalEnrolled, 1);
      assert.equal(res.body.data.stats.completedCoursesCount, 1);
      assert.equal(res.body.data.stats.averageCompletion, 100);
    });

    test('Cross-user security: second student cannot access course lessons without their own enrollment', async () => {
      const reg = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Bob Student',
          email: 'bob@test.com',
          password: 'Password123!',
          role: 'STUDENT'
        });

      assert.equal(reg.status, 201);
      const bobToken = reg.body.data.token;

      const access = await request(app)
        .get(`/api/lessons/${testLessonId}`)
        .set('Authorization', `Bearer ${bobToken}`);

      assert.equal(access.status, 403);
    });
  });

  // 5. Admin Analytics & Management
  describe('Admin Platform Analytics & Auditing', () => {
    test('Admin analytics returns platform counts', async () => {
      const res = await request(app)
        .get('/api/admin/analytics')
        .set('Authorization', `Bearer ${adminToken}`);

      assert.equal(res.status, 200);
      assert.equal(res.body.data.stats.totalUsers, 3); // Super Admin + Jane + Bob
      assert.equal(res.body.data.stats.totalCourses, 1);
      assert.equal(res.body.data.stats.publishedCourses, 1);
      assert.equal(res.body.data.stats.totalEnrollments, 1);
      assert.equal(res.body.data.stats.completedEnrollments, 1);
    });

    test('Admin can list all platform users and inspect enrollments', async () => {
      const res = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`);

      assert.equal(res.status, 200);
      assert.equal(res.body.data.users.length, 3);
    });

    test('Admin reorders curriculum lessons (PATCH /api/courses/:id/reorder)', async () => {
      const res = await request(app)
        .patch(`/api/courses/${testCourseId}/reorder`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          modules: [{ id: testModuleId, order: 1 }],
          lessons: [
            { id: testLesson2Id, moduleId: testModuleId, order: 1 },
            { id: testLessonId, moduleId: testModuleId, order: 2 }
          ]
        });

      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
    });

    test('Admin updates course metadata (PATCH /api/courses/:id)', async () => {
      const res = await request(app)
        .patch(`/api/courses/${testCourseId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Node.js Mastery Course (Updated)',
          description: 'Updated comprehensive description'
        });

      assert.equal(res.status, 200);
      assert.equal(res.body.data.course.title, 'Node.js Mastery Course (Updated)');
    });

    test('Admin creates temporary course and deletes it with cascade cleanup', async () => {
      // Create course
      const courseRes = await request(app)
        .post('/api/courses')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Temporary Course for Deletion',
          description: 'Temporary course description for deletion test',
          category: 'DevOps & Cloud'
        });
      assert.equal(courseRes.status, 201);
      const tempCourseId = courseRes.body.data.course._id;

      // Add module
      const modRes = await request(app)
        .post(`/api/courses/${tempCourseId}/modules`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ title: 'Temp Module' });
      assert.equal(modRes.status, 201);
      const tempModId = modRes.body.data.module._id;

      // Delete course
      const delRes = await request(app)
        .delete(`/api/courses/${tempCourseId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      assert.equal(delRes.status, 200);

      // Verify cascaded deletion
      const checkMod = await Module.findById(tempModId);
      assert.equal(checkMod, null);
    });
  });
});
