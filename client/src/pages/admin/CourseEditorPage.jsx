import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { courseService } from '../../services/courseService.js';
import { Button } from '../../components/common/Button.jsx';
import { Badge } from '../../components/common/Badge.jsx';
import { Modal } from '../../components/common/Modal.jsx';
import { Input } from '../../components/common/Input.jsx';
import { VideoPlayer } from '../../components/common/VideoPlayer.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Edit,
  ArrowUp,
  ArrowDown,
  Video,
  FileText,
  Clock,
  Eye,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export const CourseEditorPage = () => {
  const { id } = useParams();
  const { showToast } = useToast();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingCourse, setSavingCourse] = useState(false);

  // Course Details Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [instructor, setInstructor] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [published, setPublished] = useState(false);

  // Module Modal State
  const [moduleModalOpen, setModuleModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [moduleTitle, setModuleTitle] = useState('');
  const [moduleDescription, setModuleDescription] = useState('');

  // Lesson Modal State
  const [lessonModalOpen, setLessonModalOpen] = useState(false);
  const [targetModuleId, setTargetModuleId] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonDescription, setLessonDescription] = useState('');
  const [lessonContentType, setLessonContentType] = useState('video');
  const [lessonVideoUrl, setLessonVideoUrl] = useState('');
  const [lessonDurationMinutes, setLessonDurationMinutes] = useState(10);
  const [lessonPublished, setLessonPublished] = useState(true);

  const loadCourseData = async () => {
    try {
      const data = await courseService.getCourseById(id);
      setCourse(data);
      setTitle(data.title);
      setDescription(data.description);
      setCategory(data.category);
      setLevel(data.level);
      setInstructor(data.instructor);
      setThumbnail(data.thumbnail);
      setPublished(data.published);
    } catch (err) {
      showToast(err.message || 'Failed to load course', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourseData();
  }, [id]);

  // Save General Course Metadata
  const handleSaveCourseMetadata = async (e) => {
    e.preventDefault();
    setSavingCourse(true);
    try {
      const updated = await courseService.updateCourse(id, {
        title,
        description,
        category,
        level,
        instructor,
        thumbnail,
        published
      });
      setCourse((prev) => ({ ...prev, ...updated }));
      showToast('Course information updated successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to update course', 'error');
    } finally {
      setSavingCourse(false);
    }
  };

  // Module Handlers
  const handleOpenModuleModal = (mod = null) => {
    if (mod) {
      setEditingModule(mod);
      setModuleTitle(mod.title);
      setModuleDescription(mod.description || '');
    } else {
      setEditingModule(null);
      setModuleTitle('');
      setModuleDescription('');
    }
    setModuleModalOpen(true);
  };

  const handleSaveModule = async (e) => {
    e.preventDefault();
    try {
      if (editingModule) {
        await courseService.updateModule(editingModule._id, {
          title: moduleTitle,
          description: moduleDescription
        });
        showToast('Module updated', 'success');
      } else {
        await courseService.addModule(course._id, {
          title: moduleTitle,
          description: moduleDescription
        });
        showToast('Module added to curriculum', 'success');
      }
      setModuleModalOpen(false);
      loadCourseData();
    } catch (err) {
      showToast(err.message || 'Failed to save module', 'error');
    }
  };

  const handleDeleteModule = async (moduleId, modTitle) => {
    if (!window.confirm(`Delete module "${modTitle}" and all lessons inside it?`)) return;
    try {
      await courseService.deleteModule(moduleId);
      showToast('Module deleted', 'success');
      loadCourseData();
    } catch (err) {
      showToast(err.message || 'Failed to delete module', 'error');
    }
  };

  // Move Module Up/Down
  const handleMoveModule = async (index, direction) => {
    const modules = [...(course.modules || [])];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= modules.length) return;

    // Swap orders
    const temp = modules[index];
    modules[index] = modules[targetIdx];
    modules[targetIdx] = temp;

    const modulePayload = modules.map((m, idx) => ({ id: m._id, order: idx }));
    try {
      await courseService.reorderCurriculum(course._id, { modules: modulePayload });
      loadCourseData();
    } catch (err) {
      showToast(err.message || 'Reorder failed', 'error');
    }
  };

  // Lesson Handlers
  const handleOpenLessonModal = (moduleId, lesson = null) => {
    setTargetModuleId(moduleId);
    if (lesson) {
      setEditingLesson(lesson);
      setLessonTitle(lesson.title);
      setLessonDescription(lesson.description || '');
      setLessonContentType(lesson.contentType || 'video');
      setLessonVideoUrl(lesson.videoUrl || lesson.embedUrl || '');
      setLessonDurationMinutes(Math.round((lesson.duration || 600) / 60));
      setLessonPublished(lesson.published !== false);
    } else {
      setEditingLesson(null);
      setLessonTitle('');
      setLessonDescription('');
      setLessonContentType('video');
      setLessonVideoUrl('');
      setLessonDurationMinutes(10);
      setLessonPublished(true);
    }
    setLessonModalOpen(true);
  };

  const handleSaveLesson = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: lessonTitle,
        description: lessonDescription,
        contentType: lessonContentType,
        videoUrl: lessonVideoUrl,
        duration: Number(lessonDurationMinutes) * 60,
        published: lessonPublished
      };

      if (editingLesson) {
        await courseService.updateLesson(editingLesson._id, payload);
        showToast('Lesson updated', 'success');
      } else {
        await courseService.addLesson(targetModuleId, payload);
        showToast('Lesson added to module', 'success');
      }
      setLessonModalOpen(false);
      loadCourseData();
    } catch (err) {
      showToast(err.message || 'Failed to save lesson', 'error');
    }
  };

  const handleDeleteLesson = async (lessonId, lesTitle) => {
    if (!window.confirm(`Delete lesson "${lesTitle}"?`)) return;
    try {
      await courseService.deleteLesson(lessonId);
      showToast('Lesson deleted', 'success');
      loadCourseData();
    } catch (err) {
      showToast(err.message || 'Failed to delete lesson', 'error');
    }
  };

  // Move Lesson Up/Down
  const handleMoveLesson = async (moduleId, lessons, index, direction) => {
    const list = [...lessons];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= list.length) return;

    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;

    const lessonPayload = list.map((l, idx) => ({ id: l._id, moduleId, order: idx }));
    try {
      await courseService.reorderCurriculum(course._id, { lessons: lessonPayload });
      loadCourseData();
    } catch (err) {
      showToast(err.message || 'Reorder failed', 'error');
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-slate-400">Loading course studio...</div>
    );
  }

  if (!course) {
    return <div className="p-8 text-center text-rose-500">Course not found.</div>;
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to="/admin/courses" className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white truncate max-w-md">{course.title}</h2>
              <Badge variant={course.published ? 'success' : 'warning'}>
                {course.published ? 'Published' : 'Draft'}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Course Studio: Edit curriculum and video links</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link to={`/courses/${course.slug || course._id}`} target="_blank">
            <Button variant="outline" size="sm" icon={ExternalLink}>
              Public Preview
            </Button>
          </Link>
        </div>
      </div>

      {/* Course Metadata Form */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Course Information</h3>
        <form onSubmit={handleSaveCourseMetadata} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Course Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <Input
              label="Instructor Name"
              value={instructor}
              onChange={(e) => setInstructor(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Course Description
            </label>
            <textarea
              className="block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                className="block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
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
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              >
                <option value="Beginner" className="dark:bg-slate-900">Beginner</option>
                <option value="Intermediate" className="dark:bg-slate-900">Intermediate</option>
                <option value="Advanced" className="dark:bg-slate-900">Advanced</option>
              </select>
            </div>

            <Input
              label="Thumbnail URL"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300 dark:border-slate-700 dark:bg-slate-900"
              />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Course is published and visible to students
              </span>
            </label>

            <Button type="submit" size="sm" loading={savingCourse} icon={Save}>
              Save Course Info
            </Button>
          </div>
        </form>
      </div>

      {/* Curriculum Builder: Modules & Lessons */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Modules & Curriculum Structure</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Organize chapters, lessons, and video streams</p>
          </div>
          <Button size="sm" icon={Plus} onClick={() => handleOpenModuleModal()}>
            Add Module
          </Button>
        </div>

        {course.modules?.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 p-12 rounded-2xl border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400 transition-colors">
            No modules added to this course yet. Click "Add Module" to start structuring your course.
          </div>
        ) : (
          <div className="space-y-6">
            {course.modules?.map((mod, modIdx) => (
              <div
                key={mod._id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors"
              >
                {/* Module Bar */}
                <div className="p-4 bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-brand-100 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 font-bold text-xs flex items-center justify-center shrink-0">
                      M{modIdx + 1}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{mod.title}</h4>
                      {mod.description && <p className="text-xs text-slate-500 dark:text-slate-400">{mod.description}</p>}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 self-end sm:self-auto">
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={modIdx === 0}
                      onClick={() => handleMoveModule(modIdx, -1)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                      title="Move Module Up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={modIdx === course.modules.length - 1}
                      onClick={() => handleMoveModule(modIdx, 1)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                      title="Move Module Down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenModuleModal(mod)}
                      className="text-xs"
                      icon={Edit}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteModule(mod._id, mod.title)}
                      className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleOpenLessonModal(mod._id)}
                      icon={Plus}
                      className="text-xs"
                    >
                      Add Lesson
                    </Button>
                  </div>
                </div>

                {/* Lessons in Module */}
                <div className="p-4 space-y-2">
                  {mod.lessons?.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400 dark:text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                      No lessons inside this module yet. Click "Add Lesson".
                    </div>
                  ) : (
                    mod.lessons?.map((les, lesIdx) => (
                      <div
                        key={les._id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                            {les.contentType === 'text' ? (
                              <FileText className="w-4 h-4 text-amber-500" />
                            ) : (
                              <Video className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900 dark:text-white">{les.title}</span>
                              <Badge variant="default" size="sm">
                                {les.contentType}
                              </Badge>
                            </div>
                            <div className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-2 mt-0.5">
                              {les.videoUrl ? (
                                <span className="text-slate-500 dark:text-slate-400 truncate max-w-xs">{les.videoUrl}</span>
                              ) : (
                                <span>No video URL</span>
                              )}
                              <span>• {Math.round((les.duration || 0) / 60)} min</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 self-end sm:self-auto">
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={lesIdx === 0}
                            onClick={() => handleMoveLesson(mod._id, mod.lessons, lesIdx, -1)}
                            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                            title="Move Lesson Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={lesIdx === mod.lessons.length - 1}
                            onClick={() => handleMoveLesson(mod._id, mod.lessons, lesIdx, 1)}
                            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                            title="Move Lesson Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenLessonModal(mod._id, les)}
                            className="text-xs px-2.5 py-1"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteLesson(les._id, les.title)}
                            className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Module Modal */}
      <Modal
        isOpen={moduleModalOpen}
        onClose={() => setModuleModalOpen(false)}
        title={editingModule ? 'Edit Module' : 'Create Module'}
      >
        <form onSubmit={handleSaveModule} className="space-y-4">
          <Input
            label="Module Title"
            value={moduleTitle}
            onChange={(e) => setModuleTitle(e.target.value)}
            placeholder="e.g. Module 1 — Introduction"
            required
          />
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Description (Optional)
            </label>
            <textarea
              className="block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
              rows={2}
              value={moduleDescription}
              onChange={(e) => setModuleDescription(e.target.value)}
              placeholder="Brief summary of topics covered in this module..."
            />
          </div>
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
            <Button type="button" variant="outline" size="sm" onClick={() => setModuleModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save Module
            </Button>
          </div>
        </form>
      </Modal>

      {/* Lesson Modal */}
      <Modal
        isOpen={lessonModalOpen}
        onClose={() => setLessonModalOpen(false)}
        title={editingLesson ? 'Edit Lesson' : 'Create New Lesson'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSaveLesson} className="space-y-4">
          <Input
            label="Lesson Title"
            value={lessonTitle}
            onChange={(e) => setLessonTitle(e.target.value)}
            placeholder="e.g. 1. What is React and the Virtual DOM"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Content Type
              </label>
              <select
                className="block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                value={lessonContentType}
                onChange={(e) => setLessonContentType(e.target.value)}
              >
                <option value="video" className="dark:bg-slate-900">Video (YouTube, Vimeo, MP4)</option>
                <option value="text" className="dark:bg-slate-900">Reading / Notes</option>
                <option value="embed" className="dark:bg-slate-900">Embed Frame</option>
              </select>
            </div>

            <Input
              label="Estimated Duration (Minutes)"
              type="number"
              min="1"
              value={lessonDurationMinutes}
              onChange={(e) => setLessonDurationMinutes(e.target.value)}
            />
          </div>

          {lessonContentType !== 'text' && (
            <div>
              <Input
                label="Video URL or Embed Link"
                value={lessonVideoUrl}
                onChange={(e) => setLessonVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... or https://vimeo.com/..."
                helperText="Supports YouTube, Vimeo, direct .mp4 links, and secure https embeds."
              />
              {/* Real-time live video preview in modal */}
              {lessonVideoUrl && (
                <div className="mt-3">
                  <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                    Live Video Player Preview:
                  </span>
                  <div className="max-w-md mx-auto">
                    <VideoPlayer
                      lesson={{
                        title: lessonTitle || 'Preview',
                        contentType: lessonContentType,
                        videoUrl: lessonVideoUrl
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Lesson Description or Reading Notes
            </label>
            <textarea
              className="block w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
              rows={4}
              value={lessonDescription}
              onChange={(e) => setLessonDescription(e.target.value)}
              placeholder="Detailed explanation, lesson transcript, or code snippets..."
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="lessonPublished"
              checked={lessonPublished}
              onChange={(e) => setLessonPublished(e.target.checked)}
              className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300 dark:border-slate-700 dark:bg-slate-900"
            />
            <label htmlFor="lessonPublished" className="text-xs font-semibold text-slate-700 dark:text-slate-300 select-none">
              Lesson is published and accessible by enrolled students
            </label>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
            <Button type="button" variant="outline" size="sm" onClick={() => setLessonModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save Lesson
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
