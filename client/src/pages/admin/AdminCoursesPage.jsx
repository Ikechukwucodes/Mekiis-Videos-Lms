import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseService } from '../../services/courseService.js';
import { Button } from '../../components/common/Button.jsx';
import { Badge } from '../../components/common/Badge.jsx';
import { Modal } from '../../components/common/Modal.jsx';
import { Input } from '../../components/common/Input.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  BookOpen,
  Layers,
  Users,
  Search,
  CheckCircle
} from 'lucide-react';

export const AdminCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  // Form state
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState('Web Development');
  const [newLevel, setNewLevel] = useState('Beginner');
  const [newInstructor, setNewInstructor] = useState('Admin Instructor');
  const [newThumbnail, setNewThumbnail] = useState('');
  const [newPublished, setNewPublished] = useState(false);

  const { showToast } = useToast();

  const loadCourses = async () => {
    try {
      const data = await courseService.getAdminCourses();
      setCourses(data);
    } catch (err) {
      showToast(err.message || 'Failed to load courses', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const course = await courseService.createCourse({
        title: newTitle,
        description: newDescription,
        category: newCategory,
        level: newLevel,
        instructor: newInstructor,
        thumbnail: newThumbnail || undefined,
        published: newPublished
      });
      showToast('Course created successfully!', 'success');
      setIsCreateModalOpen(false);
      // Reset form
      setNewTitle('');
      setNewDescription('');
      loadCourses();
    } catch (err) {
      showToast(err.message || 'Failed to create course', 'error');
    } finally {
      setCreating(false);
    }
  };

  const handleTogglePublish = async (course) => {
    try {
      const updated = await courseService.updateCourse(course._id, {
        published: !course.published
      });
      showToast(
        `Course ${updated.published ? 'published to public catalog' : 'reverted to draft'}`,
        'success'
      );
      loadCourses();
    } catch (err) {
      showToast(err.message || 'Failed to update publish state', 'error');
    }
  };

  const handleDeleteCourse = async (courseId, courseTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${courseTitle}"? This will permanently delete all its modules, lessons, and progress data.`)) {
      return;
    }

    try {
      await courseService.deleteCourse(courseId);
      showToast('Course deleted successfully', 'success');
      loadCourses();
    } catch (err) {
      showToast(err.message || 'Failed to delete course', 'error');
    }
  };

  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Course Management Studio</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Create and edit courses, structure modules, and publish curricula
          </p>
        </div>
        <Button size="sm" icon={Plus} onClick={() => setIsCreateModalOpen(true)}>
          Create Course
        </Button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4 transition-colors">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search by title or category..."
            icon={Search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          {filteredCourses.length} total course{filteredCourses.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Courses Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400 dark:text-slate-500">Loading courses...</div>
        ) : filteredCourses.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500 dark:text-slate-400">
            No courses found. Click "Create Course" to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 dark:text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">Course</th>
                  <th className="px-6 py-4">Category & Level</th>
                  <th className="px-6 py-4">Structure</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredCourses.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={c.thumbnail}
                          alt={c.title}
                          className="w-12 h-12 rounded-xl object-cover bg-slate-100 dark:bg-slate-800 shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate max-w-xs">{c.title}</h4>
                          <span className="text-[11px] text-slate-400 dark:text-slate-500">By {c.instructor}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-700 dark:text-slate-300">{c.category}</div>
                      <Badge variant="default" size="sm" className="mt-1">
                        {c.level}
                      </Badge>
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-slate-600 dark:text-slate-300 font-medium">
                        {c.moduleCount || 0} Modules • {c.lessonCount || 0} Lessons
                      </div>
                      <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                        {c.enrollmentCount || 0} enrolled students
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleTogglePublish(c)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition ${
                          c.published
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/50'
                            : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/50'
                        }`}
                        title="Click to toggle published status"
                      >
                        {c.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        {c.published ? 'Published' : 'Draft'}
                      </button>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/admin/courses/${c._id}/edit`}>
                          <Button variant="outline" size="sm" icon={Edit}>
                            Curriculum Studio
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCourse(c._id, c.title)}
                          className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Course Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Course"
      >
        <form onSubmit={handleCreateCourse} className="space-y-4">
          <Input
            label="Course Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="e.g. Modern Full-Stack Architecture"
            required
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Course Description
            </label>
            <textarea
              className="block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
              rows={3}
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Provide a comprehensive summary of what students will learn..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                className="block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              >
                <option value="Web Development" className="dark:bg-slate-900">Web Development</option>
                <option value="Frontend Development" className="dark:bg-slate-900">Frontend Development</option>
                <option value="Backend Architecture" className="dark:bg-slate-900">Backend Architecture</option>
                <option value="DevOps & Cloud" className="dark:bg-slate-900">DevOps & Cloud</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Difficulty Level
              </label>
              <select
                className="block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                value={newLevel}
                onChange={(e) => setNewLevel(e.target.value)}
              >
                <option value="Beginner" className="dark:bg-slate-900">Beginner</option>
                <option value="Intermediate" className="dark:bg-slate-900">Intermediate</option>
                <option value="Advanced" className="dark:bg-slate-900">Advanced</option>
              </select>
            </div>
          </div>

          <Input
            label="Instructor Name"
            value={newInstructor}
            onChange={(e) => setNewInstructor(e.target.value)}
            placeholder="e.g. Sarah Jenkins"
          />

          <Input
            label="Thumbnail Image URL (Optional)"
            value={newThumbnail}
            onChange={(e) => setNewThumbnail(e.target.value)}
            placeholder="https://images.unsplash.com/..."
          />

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="newPublished"
              checked={newPublished}
              onChange={(e) => setNewPublished(e.target.checked)}
              className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300 dark:border-slate-700 dark:bg-slate-900"
            />
            <label htmlFor="newPublished" className="text-xs font-semibold text-slate-700 dark:text-slate-300 select-none">
              Publish immediately to public catalog
            </label>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" loading={creating}>
              Create Course
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
