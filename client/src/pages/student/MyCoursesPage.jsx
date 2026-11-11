import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { enrollmentService } from '../../services/enrollmentService.js';
import { ProgressBar } from '../../components/common/ProgressBar.jsx';
import { Button } from '../../components/common/Button.jsx';
import { Badge } from '../../components/common/Badge.jsx';
import { BookOpen, Play, CheckCircle2 } from 'lucide-react';

export const MyCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all | in_progress | completed

  useEffect(() => {
    enrollmentService
      .getMyCourses()
      .then((data) => setCourses(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredCourses = courses.filter((item) => {
    if (filter === 'completed') return item.progress.completed;
    if (filter === 'in_progress') return !item.progress.completed;
    return true;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">My Enrolled Courses</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Access your courses, watch lesson videos, and track your completion progress.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-white/85 dark:bg-[#071318]/85 backdrop-blur-md rounded-xl border border-white/60 dark:border-teal-900/40 shadow-sm w-fit transition-colors">
          {[
            { id: 'all', label: 'All Courses' },
            { id: 'in_progress', label: 'In Progress' },
            { id: 'completed', label: 'Completed' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filter === tab.id
                  ? 'bg-gradient-to-r from-[#2193b0] to-[#17697f] dark:from-[#1f4037] dark:to-[#17697f] text-white dark:text-[#99f2c8] shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-80 bg-white/90 dark:bg-[#09151a]/90 rounded-2xl border border-white/60 dark:border-teal-900/40 animate-pulse"></div>
          ))}
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="bg-white/90 dark:bg-[#071318]/90 backdrop-blur-md rounded-2xl border border-white/60 dark:border-teal-900/40 p-12 text-center max-w-md mx-auto transition-colors shadow-sm">
          <BookOpen className="w-12 h-12 text-slate-300 dark:text-teal-800 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No courses found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
            {filter === 'completed'
              ? 'You have not completed any courses yet. Keep learning!'
              : 'You are not enrolled in any matching courses.'}
          </p>
          <Link to="/courses">
            <Button size="sm">Explore Catalog</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((item) => (
            <div
              key={item.enrollmentId}
              className="bg-white/90 dark:bg-[#09151a]/90 backdrop-blur-md rounded-2xl border border-white/60 dark:border-teal-900/40 shadow-sm hover:shadow-xl hover:border-[#2193b0]/50 dark:hover:border-[#99f2c8]/50 transition overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
                  <img src={item.course.thumbnail} alt={item.course.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3">
                    <Badge variant={item.progress.completed ? 'success' : 'brand'}>
                      {item.progress.completed ? 'Completed' : 'In Progress'}
                    </Badge>
                  </div>
                </div>

                <div className="p-5">
                  <span className="text-[11px] font-bold text-[#17697f] dark:text-[#99f2c8] uppercase tracking-wider">
                    {item.course.category}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1 line-clamp-1">
                    {item.course.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {item.course.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800 mt-4 space-y-3">
                <ProgressBar percentage={item.progress.completionPercentage} size="sm" />
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {item.progress.completedCount}/{item.course.totalLessons} lessons
                  </span>
                  <Link to={`/learn/${item.course._id}`}>
                    <Button size="sm" icon={Play}>
                      {item.progress.completed ? 'Review Course' : 'Open Course'}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
