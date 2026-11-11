import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Course } from '../models/Course.js';
import { Module } from '../models/Module.js';
import { Lesson } from '../models/Lesson.js';
import { Enrollment } from '../models/Enrollment.js';
import { Progress } from '../models/Progress.js';
import { slugify } from '../utils/slugify.js';

export const seedDatabase = async () => {
  console.log('🌱 Starting database seeding...');

  // 1. Clear existing collections
  await Promise.all([
    User.deleteMany({}),
    Course.deleteMany({}),
    Module.deleteMany({}),
    Lesson.deleteMany({}),
    Enrollment.deleteMany({}),
    Progress.deleteMany({})
  ]);
  console.log('🧹 Cleaned existing database records.');

  // 2. Create Users
  const salt = await bcrypt.genSalt(10);
  const adminPasswordHash = await bcrypt.hash('AdminPass123!', salt);
  const studentPasswordHash = await bcrypt.hash('StudentPass123!', salt);

  const admin = await User.create({
    name: 'Admin Instructor',
    email: 'admin@lms.com',
    passwordHash: adminPasswordHash,
    role: 'ADMIN'
  });

  const student = await User.create({
    name: 'Alex Morgan',
    email: 'student@lms.com',
    passwordHash: studentPasswordHash,
    role: 'STUDENT'
  });

  console.log(`👤 Created Users: Admin (${admin.email}) and Student (${student.email})`);

  // 3. Create Course 1: JavaScript Fundamentals
  const jsCourse = await Course.create({
    title: 'JavaScript Fundamentals & Modern ES6+',
    slug: slugify('JavaScript Fundamentals & Modern ES6+'),
    description:
      'Master the language of the modern web. From core syntax, variables, and closures to asynchronous programming and DOM mastery, this course builds an unshakable foundation.',
    thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&auto=format&fit=crop&q=60',
    category: 'Web Development',
    level: 'Beginner',
    instructor: 'Sarah Jenkins, Senior Architect',
    published: true
  });

  // Module 1
  const mod1 = await Module.create({
    courseId: jsCourse._id,
    title: 'Module 1 — Core JavaScript & Execution Context',
    description: 'Learn how JavaScript runs in the browser, call stacks, memory heap, and variable declarations.',
    order: 0
  });

  const l1_1 = await Lesson.create({
    courseId: jsCourse._id,
    moduleId: mod1._id,
    title: '1. What is JavaScript & The V8 Engine',
    description: 'A deep dive into how JavaScript executes code, JIT compilation, and JavaScript runtime fundamentals.',
    contentType: 'video',
    videoUrl: 'https://www.youtube.com/watch?v=W6NZfCO5SIk',
    embedUrl: 'https://www.youtube-nocookie.com/embed/W6NZfCO5SIk?rel=0&enablejsapi=1',
    duration: 720,
    order: 0,
    published: true
  });

  const l1_2 = await Lesson.create({
    courseId: jsCourse._id,
    moduleId: mod1._id,
    title: '2. Variables, Primitive Data Types & Scope',
    description: 'Deep dive into let, const, var, block scoping, hoisting, and primitive vs reference types.',
    contentType: 'video',
    videoUrl: 'https://www.youtube.com/watch?v=edlFjlzxkSI',
    embedUrl: 'https://www.youtube-nocookie.com/embed/edlFjlzxkSI?rel=0&enablejsapi=1',
    duration: 840,
    order: 1,
    published: true
  });

  const l1_3 = await Lesson.create({
    courseId: jsCourse._id,
    moduleId: mod1._id,
    title: '3. Functions, Closures & Lexical Scope',
    description: 'Master function expressions, arrow functions, higher-order functions, and closures with real examples.',
    contentType: 'video',
    videoUrl: 'https://www.youtube.com/watch?v=vDJpGenyHaA',
    embedUrl: 'https://www.youtube-nocookie.com/embed/vDJpGenyHaA?rel=0&enablejsapi=1',
    duration: 900,
    order: 2,
    published: true
  });

  // Module 2
  const mod2 = await Module.create({
    courseId: jsCourse._id,
    title: 'Module 2 — Asynchronous JavaScript & Promises',
    description: 'Understand the event loop, microtask queue, callbacks, Promises, and async/await syntax.',
    order: 1
  });

  const l2_1 = await Lesson.create({
    courseId: jsCourse._id,
    moduleId: mod2._id,
    title: '4. The JavaScript Event Loop & Concurrency',
    description: 'Visualizing how asynchronous timers, promises, and the event loop work behind the scenes.',
    contentType: 'video',
    videoUrl: 'https://www.youtube.com/watch?v=8aGhZQkoFbQ',
    embedUrl: 'https://www.youtube-nocookie.com/embed/8aGhZQkoFbQ?rel=0&enablejsapi=1',
    duration: 1100,
    order: 0,
    published: true
  });

  const l2_2 = await Lesson.create({
    courseId: jsCourse._id,
    moduleId: mod2._id,
    title: '5. Promises & Async/Await Error Handling',
    description: 'Writing clean, resilient asynchronous code with Promise.all, Promise.allSettled, and try/catch blocks.',
    contentType: 'video',
    videoUrl: 'https://www.youtube.com/watch?v=V_Kr9OSfDeU',
    embedUrl: 'https://www.youtube-nocookie.com/embed/V_Kr9OSfDeU?rel=0&enablejsapi=1',
    duration: 950,
    order: 1,
    published: true
  });

  // Module 3
  const mod3 = await Module.create({
    courseId: jsCourse._id,
    title: 'Module 3 — Working with APIs and DOM',
    description: 'Fetch real data from REST APIs, handle loading states, and update the document object model.',
    order: 2
  });

  const l3_1 = await Lesson.create({
    courseId: jsCourse._id,
    moduleId: mod3._id,
    title: '6. Fetch API, JSON, and Network Requests',
    description: 'Sending GET, POST, PUT requests using native Fetch with proper error boundary handling.',
    contentType: 'video',
    videoUrl: 'https://www.youtube.com/watch?v=cuEtnrL9-H0',
    embedUrl: 'https://www.youtube-nocookie.com/embed/cuEtnrL9-H0?rel=0&enablejsapi=1',
    duration: 890,
    order: 0,
    published: true
  });

  const l3_2 = await Lesson.create({
    courseId: jsCourse._id,
    moduleId: mod3._id,
    title: '7. Comprehensive Project Summary & Next Steps',
    description: 'Consolidating everything we learned into modular, maintainable ES module code.',
    contentType: 'text',
    duration: 400,
    order: 1,
    published: true
  });

  // 4. Create Course 2: React & Modern Frontend Architecture
  const reactCourse = await Course.create({
    title: 'React 18 & Enterprise Frontend Architecture',
    slug: slugify('React 18 & Enterprise Frontend Architecture'),
    description:
      'Learn how to architect scalable, high-performance React applications with hooks, context, routing, custom state managers, and clean design patterns.',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60',
    category: 'Frontend Development',
    level: 'Intermediate',
    instructor: 'David Kim, Staff Frontend Engineer',
    published: true
  });

  const rMod1 = await Module.create({
    courseId: reactCourse._id,
    title: 'Module 1 — Component Foundations & Virtual DOM',
    description: 'Explore JSX, functional components, props validation, and virtual DOM diffing algorithms.',
    order: 0
  });

  await Lesson.create({
    courseId: reactCourse._id,
    moduleId: rMod1._id,
    title: '1. React Architectural Fundamentals',
    description: 'Why React was created, declarative UI concepts, and component composition.',
    contentType: 'video',
    videoUrl: 'https://www.youtube.com/watch?v=SqcY0GlETPk',
    embedUrl: 'https://www.youtube-nocookie.com/embed/SqcY0GlETPk?rel=0&enablejsapi=1',
    duration: 800,
    order: 0,
    published: true
  });

  await Lesson.create({
    courseId: reactCourse._id,
    moduleId: rMod1._id,
    title: '2. Hooks Deep Dive: useState & useEffect',
    description: 'Managing reactive state and side effects with correct dependency array specifications.',
    contentType: 'video',
    videoUrl: 'https://www.youtube.com/watch?v=O6P86uwfdR0',
    embedUrl: 'https://www.youtube-nocookie.com/embed/O6P86uwfdR0?rel=0&enablejsapi=1',
    duration: 920,
    order: 1,
    published: true
  });

  // 5. Create Course 3: Draft course for testing Admin publish flow
  await Course.create({
    title: 'Building Microservices with Node.js & Docker',
    slug: slugify('Building Microservices with Node.js & Docker'),
    description:
      'Draft course for backend engineers looking to break monoliths into resilient, containerized services.',
    thumbnail: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?w=800&auto=format&fit=crop&q=60',
    category: 'Backend Architecture',
    level: 'Advanced',
    instructor: 'Admin Instructor',
    published: false // Draft!
  });

  // 6. Enroll student in JavaScript course with partial progress (2 lessons completed out of 7 = 29%)
  await Enrollment.create({
    userId: student._id,
    courseId: jsCourse._id,
    enrolledAt: new Date(),
    status: 'active'
  });

  await Progress.create({
    userId: student._id,
    courseId: jsCourse._id,
    currentLessonId: l1_3._id, // Resumes at Lesson 3
    lastAccessedLessonId: l1_2._id,
    completedLessons: [l1_1._id, l1_2._id],
    completionPercentage: 29,
    completed: false,
    lastAccessedAt: new Date()
  });

  console.log('🎉 Seeding successfully completed!');
  console.log('---------------------------------------------------------');
  console.log('Default Credentials:');
  console.log('👉 Admin:   admin@lms.com   / AdminPass123!');
  console.log('👉 Student: student@lms.com / StudentPass123!');
  console.log('---------------------------------------------------------');
};

// Execute if run directly from CLI
if (process.argv[1]?.endsWith('seed.js')) {
  (async () => {
    try {
      await connectDB();
      await seedDatabase();
      await disconnectDB();
      process.exit(0);
    } catch (err) {
      console.error('❌ Seeding failed:', err);
      process.exit(1);
    }
  })();
}
