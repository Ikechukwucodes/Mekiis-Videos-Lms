import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { courseService } from '../../services/courseService.js';
import { progressService } from '../../services/progressService.js';
import { VideoPlayer } from '../../components/common/VideoPlayer.jsx';
import { ProgressBar } from '../../components/common/ProgressBar.jsx';
import { Button } from '../../components/common/Button.jsx';
import { Badge } from '../../components/common/Badge.jsx';
import { ThemeToggle } from '../../components/common/ThemeToggle.jsx';
import { Logo } from '../../components/common/Logo.jsx';
import { CertificateModal } from '../../components/common/CertificateModal.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  Play,
  FileText,
  Clock,
  Menu,
  X,
  Award,
  Check,
  GraduationCap
} from 'lucide-react';

export const CoursePlayerPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { showToast } = useToast();

  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [certificateOpen, setCertificateOpen] = useState(false);

  // Flattened ordered lessons for easy previous/next navigation
  const [orderedLessons, setOrderedLessons] = useState([]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login', { replace: true, state: { from: `/learn/${courseId}` } });
      return;
    }
    if (!authLoading && isAuthenticated) {
      loadCourseAndProgress();
    }
  }, [courseId, authLoading, isAuthenticated]);

  const loadCourseAndProgress = async () => {
    try {
      const [courseData, progressData] = await Promise.all([
        courseService.getCourseById(courseId),
        progressService.getCourseProgress(courseId)
      ]);

      setCourse(courseData);
      setProgress(progressData.progress);

      // Flatten lessons in order
      const flat = [];
      courseData.modules?.forEach((mod) => {
        mod.lessons?.forEach((les) => {
          flat.push({ ...les, moduleTitle: mod.title });
        });
      });
      setOrderedLessons(flat);

      // Determine initial active lesson
      const activeId = progressData.progress?.currentLessonId || (flat.length > 0 ? flat[0]._id : null);
      const matched = flat.find((l) => l._id.toString() === activeId?.toString()) || flat[0];
      if (matched) {
        const full = await courseService.getLesson(matched._id);
        setCurrentLesson({ ...matched, ...full, moduleTitle: matched.moduleTitle });
      } else {
        setCurrentLesson(null);
      }
    } catch (err) {
      showToast(err.message || 'Failed to load course player', 'error');
      navigate('/dashboard/courses');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectLesson = async (lesson) => {
    setSidebarOpen(false);
    try {
      const full = await courseService.getLesson(lesson._id);
      setCurrentLesson({ ...lesson, ...full, moduleTitle: lesson.moduleTitle });
      await progressService.updateCurrentLesson(courseId, lesson._id);
    } catch (err) {
      showToast(err.message || 'Unable to open this lesson', 'error');
    }
  };

  const handleCompleteLesson = async () => {
    if (!currentLesson || isCompleted(currentLesson._id)) return;
    setCompleting(true);
    try {
      const res = await progressService.completeLesson(currentLesson._id);
      setProgress(res.progress);
      showToast('Lesson marked as completed!', 'success');

      // If course is 100% finished, trigger certificate celebration
      if (res.completed) {
        setCertificateOpen(true);
      } else if (res.nextLessonId) {
        // If there's a next lesson recommended by backend progress service, navigate to it
        const next = orderedLessons.find((l) => l._id.toString() === res.nextLessonId.toString());
        if (next) {
          await handleSelectLesson(next);
        }
      }
    } catch (err) {
      showToast(err.message || 'Failed to complete lesson', 'error');
    } finally {
      setCompleting(false);
    }
  };

  const currentIndex = orderedLessons.findIndex((l) => l._id?.toString() === currentLesson?._id?.toString());
  const prevLesson = currentIndex > 0 ? orderedLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex >= 0 && currentIndex < orderedLessons.length - 1 ? orderedLessons[currentIndex + 1] : null;

  const isCompleted = (lessonId) => {
    return progress?.completedLessons?.some((id) => (id._id || id).toString() === lessonId?.toString());
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-500"></div>
          <span className="text-xs text-slate-400 font-semibold tracking-wider uppercase">Loading Learning Session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white/20 via-transparent to-white/10 dark:from-[#081217]/60 dark:via-[#102624]/40 dark:to-[#081217]/60 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Header */}
      <header className="h-16 bg-white/85 dark:bg-[#071217]/85 backdrop-blur-md border-b border-white/40 dark:border-teal-900/40 px-4 sm:px-6 flex items-center justify-between shrink-0 z-30 transition-colors">
        <div className="flex items-center gap-3">
          <Link to="/" title="Return to Home" className="flex items-center hover:opacity-85 transition">
            <Logo variant="mark" size="sm" />
          </Link>
          <div className="h-4 w-px bg-slate-200 dark:bg-teal-900/60"></div>
          <Link
            to="/dashboard/courses"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-2 py-1.5 rounded-lg hover:bg-white/80 dark:hover:bg-[#0c1e24] transition"
          >
            <ChevronLeft className="w-4 h-4" /> My Courses
          </Link>
          <div className="hidden sm:block h-4 w-px bg-slate-200 dark:bg-teal-900/60"></div>
          <h1 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-xs sm:max-w-md">
            {course?.title}
          </h1>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <ThemeToggle size="sm" />

          {/* Certificate Button if Course is 100% Completed */}
          {progress?.completed && (
            <Button
              variant="outline"
              size="sm"
              icon={Award}
              onClick={() => setCertificateOpen(true)}
              className="bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-300 hover:bg-amber-500/20 text-xs"
            >
              View Certificate
            </Button>
          )}

          {/* Progress Indicator */}
          <div className="hidden md:flex items-center gap-3 w-48">
            <ProgressBar
              percentage={progress?.completionPercentage || 0}
              size="sm"
              showLabel={false}
              className="w-32"
            />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 tabular-nums">
              {progress?.completionPercentage || 0}%
            </span>
          </div>

          {/* Toggle Sidebar on mobile */}
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 min-h-11 min-w-11 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-[#0c1e24] transition"
            aria-label={sidebarOpen ? 'Close course curriculum' : 'Open course curriculum'}
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Main Content Area (Player & Lesson Details) */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Video Player with auto-ended callback */}
            <VideoPlayer lesson={currentLesson} onEnded={handleCompleteLesson} />

            {/* Lesson Title & Mark Complete Header */}
            <div className="bg-white/95 dark:bg-[#071318]/95 backdrop-blur-md rounded-2xl p-6 border border-white/60 dark:border-teal-900/40 shadow-xl space-y-6 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-[#17697f] dark:text-[#99f2c8] uppercase tracking-wider">
                    {currentLesson?.moduleTitle}
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{currentLesson?.title}</h2>
                  {currentLesson?.duration ? (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-2">
                      <Clock className="w-3.5 h-3.5" />
                      Estimated duration: {Math.round(currentLesson.duration / 60)} minutes
                    </div>
                  ) : null}
                </div>

                {/* Mark Complete CTA */}
                <div>
                  {isCompleted(currentLesson?._id) ? (
                    <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-400 text-xs font-bold shadow-sm">
                      <Check className="w-4 h-4" /> Lesson Completed
                    </div>
                  ) : (
                    <Button
                      variant="primary"
                      size="md"
                      onClick={handleCompleteLesson}
                      loading={completing}
                      icon={CheckCircle2}
                    >
                      Mark Complete
                    </Button>
                  )}
                </div>
              </div>

              {/* Lesson Description */}
              {currentLesson?.description && (
                <div className="pt-6 border-t border-slate-100/80 dark:border-teal-950/80 text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {currentLesson.description}
                </div>
              )}

              {/* Navigation Controls: Previous / Next */}
              <div className="pt-6 border-t border-slate-100/80 dark:border-teal-950/80 flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!prevLesson}
                  onClick={() => prevLesson && handleSelectLesson(prevLesson)}
                  icon={ChevronLeft}
                >
                  Previous Lesson
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  disabled={!nextLesson}
                  onClick={() => nextLesson && handleSelectLesson(nextLesson)}
                  icon={ChevronRight}
                  iconPosition="right"
                >
                  Next Lesson
                </Button>
              </div>
            </div>
          </div>
        </main>

        {/* Course Curriculum Sidebar */}
        <aside
          className={`fixed lg:static inset-y-16 right-0 w-80 sm:w-96 bg-white/90 dark:bg-[#071318]/90 backdrop-blur-md border-l border-white/40 dark:border-teal-900/40 flex flex-col z-20 transition-transform duration-300 ${
            sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
          }`}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b border-slate-200/80 dark:border-teal-900/40 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Course Curriculum</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                {progress?.completedLessons?.length || 0} of {orderedLessons.length} lessons completed
              </p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Module & Lesson List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100/60 dark:divide-teal-950/50 p-2 space-y-3">
            {course?.modules?.map((mod, modIdx) => (
              <div key={mod._id} className="pt-2">
                <div className="px-3 py-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {mod.title}
                </div>
                <div className="space-y-1 mt-1">
                  {mod.lessons?.map((les) => {
                    const active = les._id === currentLesson?._id;
                    const completed = isCompleted(les._id);

                    return (
                      <button
                        key={les._id}
                        onClick={() => handleSelectLesson({ ...les, moduleTitle: mod.title })}
                        className={`w-full text-left p-3 rounded-xl flex items-start gap-3 transition text-xs ${
                          active
                            ? 'bg-cyan-50 dark:bg-teal-950/60 border border-cyan-200/80 dark:border-teal-800/60 text-[#17697f] dark:text-[#99f2c8]'
                            : 'hover:bg-slate-50 dark:hover:bg-[#0c1e24] text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {completed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                          ) : active ? (
                            <div className="w-4 h-4 rounded-full border-2 border-[#2193b0] dark:border-[#99f2c8] flex items-center justify-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#2193b0] dark:bg-[#99f2c8] animate-ping"></div>
                            </div>
                          ) : (
                            <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className={`font-semibold truncate ${active ? 'text-[#17697f] dark:text-[#99f2c8]' : 'text-slate-800 dark:text-slate-200'}`}>
                            {les.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400 dark:text-slate-500">
                            {les.contentType === 'text' ? (
                              <span className="flex items-center gap-1">
                                <FileText className="w-3 h-3 text-amber-500" /> Reading
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <Play className="w-3 h-3 text-[#2193b0] dark:text-[#99f2c8]" /> Video
                              </span>
                            )}
                            {les.duration ? (
                              <span>• {Math.round(les.duration / 60)} min</span>
                            ) : null}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {/* Course Completion & Certificate Modal */}
      <CertificateModal
        isOpen={certificateOpen}
        onClose={() => setCertificateOpen(false)}
        courseTitle={course?.title || 'Course'}
        studentName={user?.name || 'Student'}
        instructorName={course?.instructor || 'Mekiis Videos Instructor'}
      />
    </div>
  );
};
