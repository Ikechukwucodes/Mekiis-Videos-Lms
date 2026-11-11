import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { enrollmentService } from '../../services/enrollmentService.js';
import { progressService } from '../../services/progressService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { ProgressBar } from '../../components/common/ProgressBar.jsx';
import { Button } from '../../components/common/Button.jsx';
import { Badge } from '../../components/common/Badge.jsx';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Play,
  TrendingUp,
  Award,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const StudentDashboardPage = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([enrollmentService.getMyCourses(), progressService.getStudentStats()])
      .then(([coursesData, statsData]) => {
        setCourses(coursesData);
        setStats(statsData);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Find recently accessed / in-progress courses for "Continue Learning"
  const continueLearningCourses = [...courses]
    .filter((c) => !c.progress.completed)
    .sort((a, b) => new Date(b.progress.lastAccessedAt || 0) - new Date(a.progress.lastAccessedAt || 0));

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-28 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#2193b0] via-[#17697f] to-[#0d5568] dark:from-[#09151a] dark:via-[#1f4037] dark:to-[#0f2a24] rounded-3xl p-8 text-white shadow-xl shadow-cyan-900/20 dark:shadow-teal-950/40 border border-white/30 dark:border-[#99f2c8]/30 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 dark:bg-[#1f4037]/60 backdrop-blur-sm text-xs font-semibold text-white dark:text-[#99f2c8] uppercase tracking-wider mb-3 border border-white/30 dark:border-[#99f2c8]/30">
            <Sparkles className="w-3.5 h-3.5" /> Student Dashboard
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Welcome back, {user?.name}!</h1>
          <p className="mt-2 text-white/90 text-sm leading-relaxed">
            Your progress is saved securely. Pick up right where you left off or explore new topics.
          </p>
        </div>
      </div>

      {/* Statistics Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          {
            title: 'Enrolled Courses',
            value: stats?.totalEnrolled || 0,
            icon: BookOpen,
            color: 'text-[#17697f] dark:text-[#99f2c8] bg-cyan-100/70 dark:bg-teal-950/70'
          },
          {
            title: 'Courses In Progress',
            value: stats?.inProgressCount || 0,
            icon: Clock,
            color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60'
          },
          {
            title: 'Completed Courses',
            value: stats?.completedCoursesCount || 0,
            icon: CheckCircle2,
            color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60'
          },
          {
            title: 'Average Progress',
            value: `${stats?.averageCompletion || 0}%`,
            icon: TrendingUp,
            color: 'text-[#2193b0] dark:text-[#5eead4] bg-cyan-50 dark:bg-teal-900/40'
          }
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="bg-white/90 dark:bg-[#071318]/90 backdrop-blur-md p-5 rounded-2xl border border-white/60 dark:border-teal-900/40 shadow-sm flex items-center gap-4 transition-colors">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{item.title}</span>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{item.value}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Continue Learning Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Continue Learning</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Pick up right from your last lesson</p>
          </div>
          <Link to="/dashboard/courses" className="text-xs font-bold text-[#17697f] dark:text-[#99f2c8] hover:underline flex items-center gap-1">
            View All ({courses.length}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {continueLearningCourses.length === 0 ? (
          <div className="bg-white/90 dark:bg-[#071318]/90 backdrop-blur-md rounded-2xl border border-white/60 dark:border-teal-900/40 p-8 text-center max-w-md mx-auto transition-colors shadow-sm">
            <Award className="w-12 h-12 text-slate-300 dark:text-teal-800 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No active courses in progress</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
              {courses.length > 0
                ? 'Great job! You have completed all your enrolled courses.'
                : 'You have not enrolled in any courses yet.'}
            </p>
            <Link to="/courses">
              <Button size="sm">Browse Course Catalog</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {continueLearningCourses.slice(0, 2).map((item) => (
              <div
                key={item.enrollmentId}
                className="bg-white/90 dark:bg-[#09151a]/90 backdrop-blur-md rounded-2xl border border-white/60 dark:border-teal-900/40 p-6 shadow-sm hover:shadow-xl hover:border-[#2193b0]/50 dark:hover:border-[#99f2c8]/50 transition flex flex-col justify-between"
              >
                <div className="flex gap-4">
                  <img
                    src={item.course.thumbnail}
                    alt={item.course.title}
                    className="w-24 h-24 rounded-xl object-cover shrink-0 bg-slate-100 dark:bg-slate-800"
                  />
                  <div className="flex-1 min-w-0">
                    <Badge variant="brand" size="sm" className="mb-1.5">
                      {item.course.category}
                    </Badge>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                      {item.course.title}
                    </h3>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                      <Play className="w-3.5 h-3.5 text-[#2193b0] dark:text-[#99f2c8] fill-current" />
                      Current Lesson:{' '}
                      <strong className="text-slate-800 dark:text-slate-200 truncate">
                        {item.progress.currentLesson?.title || 'First Lesson'}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100/80 dark:border-teal-950/80 space-y-3">
                  <ProgressBar percentage={item.progress.completionPercentage} size="sm" />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600 dark:text-slate-400">
                      {item.progress.completedCount} of {item.course.totalLessons} lessons completed
                    </span>
                    <Link to={`/learn/${item.course._id}`}>
                      <Button size="sm" icon={Play}>
                        Resume Learning
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
