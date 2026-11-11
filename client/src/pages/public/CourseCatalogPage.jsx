import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseService } from '../../services/courseService.js';
import { Input } from '../../components/common/Input.jsx';
import { Button } from '../../components/common/Button.jsx';
import { Badge } from '../../components/common/Badge.jsx';
import { Search, BookOpen, Layers, Clock, Filter } from 'lucide-react';

export const CourseCatalogPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [level, setLevel] = useState('All');

  const categories = ['All', 'Web Development', 'Frontend Development', 'Backend Architecture', 'DevOps & Cloud'];
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const data = await courseService.getCourses({ search, category, level });
      setCourses(data);
    } catch (err) {
      console.error('Failed to load courses', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchCourses();
    }, 250);
    return () => clearTimeout(delayDebounce);
  }, [search, category, level]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Explore Courses</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
          Browse comprehensive video courses and advance your professional skills.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white/90 dark:bg-[#071318]/90 backdrop-blur-md p-5 rounded-2xl border border-white/60 dark:border-teal-900/40 shadow-sm mb-8 space-y-4 transition-colors">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-6">
            <Input
              placeholder="Search courses by title, keywords, or topics..."
              icon={Search}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="md:col-span-3">
            <select
              className="block w-full rounded-xl border border-slate-200/80 dark:border-teal-900/60 bg-white dark:bg-[#0a161c] px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              {levels.map((lvl) => (
                <option key={lvl} value={lvl} className="dark:bg-[#071318]">
                  Level: {lvl}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3 flex justify-end">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Showing {courses.length} course{courses.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100/80 dark:border-teal-950/80">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mr-2 shrink-0">
            Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition shrink-0 ${
                category === cat
                  ? 'bg-gradient-to-r from-[#2193b0] to-[#17697f] dark:from-[#1f4037] dark:to-[#17697f] text-white dark:text-[#99f2c8] shadow-sm'
                  : 'bg-slate-100/80 dark:bg-teal-950/50 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-teal-900/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white/90 dark:bg-[#09151a]/90 rounded-2xl border border-white/60 dark:border-teal-900/40 h-96 animate-pulse p-4"></div>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="bg-white/90 dark:bg-[#09151a]/90 backdrop-blur-md rounded-2xl border border-white/60 dark:border-teal-900/40 p-12 text-center max-w-lg mx-auto shadow-sm">
          <BookOpen className="w-12 h-12 text-slate-300 dark:text-teal-800 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No courses match your criteria</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Try adjusting your search terms or clearing your category filters.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => {
              setSearch('');
              setCategory('All');
              setLevel('All');
            }}
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white/90 dark:bg-[#09151a]/90 backdrop-blur-md rounded-2xl border border-white/60 dark:border-teal-900/40 shadow-sm hover:shadow-xl hover:border-[#2193b0]/50 dark:hover:border-[#99f2c8]/50 transition overflow-hidden flex flex-col group"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute top-3 right-3">
                  <Badge variant="brand">{course.level}</Badge>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-[#17697f] dark:text-[#99f2c8] uppercase tracking-wider">
                    {course.category}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1 line-clamp-1 group-hover:text-[#2193b0] dark:group-hover:text-[#99f2c8] transition">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-teal-950/80 flex items-center justify-between">
                  <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-[#2193b0] dark:text-[#99f2c8]" /> {course.moduleCount || 0} Modules
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-[#2193b0] dark:text-[#99f2c8]" /> {course.lessonCount || 0} Lessons
                    </span>
                  </div>

                  <Link to={`/courses/${course.slug || course._id}`}>
                    <Button size="sm" variant="primary">
                      View Course
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
