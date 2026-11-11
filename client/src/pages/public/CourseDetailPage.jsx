import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { courseService } from '../../services/courseService.js';
import { enrollmentService } from '../../services/enrollmentService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { Button } from '../../components/common/Button.jsx';
import { Badge } from '../../components/common/Badge.jsx';
import {
  Play,
  CheckCircle,
  Clock,
  Layers,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  FileText
} from 'lucide-react';

export const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [openModules, setOpenModules] = useState({});

  useEffect(() => {
    courseService
      .getCourseById(id)
      .then((data) => {
        setCourse(data);
        // Open the first module by default
        if (data.modules && data.modules.length > 0) {
          setOpenModules({ [data.modules[0]._id]: true });
        }
      })
      .catch((err) => {
        showToast(err.message || 'Course not found', 'error');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const toggleModule = (modId) => {
    setOpenModules((prev) => ({ ...prev, [modId]: !prev[modId] }));
  };

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/courses/${id}` } });
      return;
    }

    setEnrolling(true);
    try {
      await enrollmentService.enroll(course._id);
      showToast('Successfully enrolled! Welcome to the course.', 'success');
      navigate(`/learn/${course._id}`);
    } catch (err) {
      showToast(err.message || 'Enrollment failed', 'error');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <h2 className="text-xl font-bold text-slate-800">Course not found</h2>
        <Link to="/courses" className="mt-4 inline-block">
          <Button variant="outline" size="sm">
            Back to Catalog
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      {/* Course Hero Banner with Linear Gradient */}
      <section className="bg-gradient-to-r from-[#17697f] via-[#2193b0] to-[#17697f] dark:from-[#09151a] dark:via-[#1f4037] dark:to-[#071318] text-white py-16 border-b border-white/20 dark:border-teal-950/60 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="ocean">{course.category}</Badge>
                <Badge variant="default" className="text-slate-200 bg-white/10 border-white/20">
                  {course.level}
                </Badge>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                {course.title}
              </h1>

              <p className="text-white/90 text-base leading-relaxed max-w-2xl">
                {course.description}
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-white/80">
                <span>
                  Instructor: <strong className="text-white">{course.instructor}</strong>
                </span>
                <span>
                  Curriculum: <strong className="text-white">{course.modules?.length || 0} Modules</strong>
                </span>
                <span>
                  Content: <strong className="text-white">{course.totalLessons || 0} Lessons</strong>
                </span>
              </div>
            </div>

            {/* Action Card */}
            <div className="lg:col-span-4">
              <div className="bg-white/95 dark:bg-[#071318]/95 backdrop-blur-md text-slate-900 dark:text-slate-100 rounded-2xl p-6 shadow-xl border border-white/60 dark:border-teal-900/40 transition-colors">
                <div className="aspect-video w-full rounded-xl overflow-hidden mb-5 bg-slate-100 dark:bg-slate-800 relative">
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-slate-950/20 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/95 dark:bg-[#0d2024]/95 text-[#2193b0] dark:text-[#99f2c8] flex items-center justify-center shadow-lg">
                      <Play className="w-5 h-5 ml-0.5 fill-current" />
                    </div>
                  </div>
                </div>

                {course.isEnrolled ? (
                  <Link to={`/learn/${course._id}`} className="block">
                    <Button size="lg" className="w-full" icon={Play}>
                      Continue Learning
                    </Button>
                  </Link>
                ) : (
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={handleEnroll}
                    loading={enrolling}
                    icon={ArrowRight}
                    iconPosition="right"
                  >
                    Enroll Now (Free)
                  </Button>
                )}

                <div className="mt-4 pt-4 border-t border-slate-100/80 dark:border-teal-950/80 text-center">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" /> Full lifetime access included
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Outline Accordion */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Course Curriculum</h2>

          <div className="space-y-4">
            {course.modules?.map((mod, index) => {
              const isOpen = openModules[mod._id];
              return (
                <div
                  key={mod._id}
                  className="bg-white/90 dark:bg-[#09151a]/90 backdrop-blur-md rounded-2xl border border-white/60 dark:border-teal-900/40 overflow-hidden shadow-sm transition"
                >
                  <button
                    onClick={() => toggleModule(mod._id)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-teal-950/30 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-cyan-100/70 dark:bg-teal-950/70 text-[#17697f] dark:text-[#99f2c8] text-xs font-bold flex items-center justify-center">
                        {index + 1}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{mod.title}</h4>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {mod.lessons?.length || 0} lessons {mod.description ? `• ${mod.description}` : ''}
                        </span>
                      </div>
                    </div>
                    {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400 dark:text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-400 dark:text-slate-500" />}
                  </button>

                  {isOpen && (
                    <div className="border-t border-slate-100/80 dark:border-teal-950/80 divide-y divide-slate-100/60 dark:divide-teal-950/50">
                      {mod.lessons?.map((lesson, lIdx) => (
                        <div key={lesson._id} className="px-6 py-3.5 flex items-center justify-between hover:bg-cyan-50/40 dark:hover:bg-teal-950/40 text-xs transition">
                          <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                            {lesson.contentType === 'text' ? (
                              <FileText className="w-4 h-4 text-amber-500 shrink-0" />
                            ) : (
                              <Play className="w-4 h-4 text-[#2193b0] dark:text-[#99f2c8] shrink-0" />
                            )}
                            <span className="font-medium text-slate-900 dark:text-slate-100">{lesson.title}</span>
                          </div>
                          <div className="flex items-center gap-3 text-slate-400 dark:text-slate-500">
                            {lesson.duration ? (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {Math.round(lesson.duration / 60)} min
                              </span>
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
