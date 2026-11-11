import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService.js';
import { Button } from '../../components/common/Button.jsx';
import { Badge } from '../../components/common/Badge.jsx';
import {
  Users,
  BookOpen,
  Award,
  TrendingUp,
  PlusCircle,
  Eye,
  CheckCircle,
  Clock,
  Sparkles
} from 'lucide-react';

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService
      .getAnalytics()
      .then(setStats)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-32 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800"></div>
          ))}
        </div>
      </div>
    );
  }

  const cards = [
    { title: 'Total Registered Users', value: stats?.totalUsers || 0, icon: Users, color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60' },
    { title: 'Total Courses Created', value: stats?.totalCourses || 0, icon: BookOpen, color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60' },
    { title: 'Published Courses', value: stats?.publishedCourses || 0, icon: Eye, color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60' },
    { title: 'Draft Courses', value: stats?.draftCourses || 0, icon: Clock, color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60' },
    { title: 'Total Enrollments', value: stats?.totalEnrollments || 0, icon: Award, color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60' },
    { title: 'Active Learners (30d)', value: stats?.activeLearnersCount || 0, icon: TrendingUp, color: 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60' }
  ];

  return (
    <div className="space-y-8">
      {/* Quick Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Admin Operations Overview</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">High-level telemetry and quick course management actions</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link to="/admin/courses">
            <Button size="sm" icon={PlusCircle}>
              Manage Courses
            </Button>
          </Link>
          <Link to="/admin/users">
            <Button variant="outline" size="sm" icon={Users}>
              View Users
            </Button>
          </Link>
        </div>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-colors">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${card.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{card.title}</span>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{card.value}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Enrollments Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent Student Enrollments</h3>
          <Link to="/admin/enrollments" className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300">
            View All →
          </Link>
        </div>

        {stats?.recentEnrollments?.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400">No enrollments recorded yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 dark:text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-3.5">Student</th>
                  <th className="px-6 py-3.5">Course</th>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {stats?.recentEnrollments?.map((enr) => (
                  <tr key={enr._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                      {enr.userId?.name || 'Deleted User'}
                      <div className="text-[11px] font-normal text-slate-400 dark:text-slate-500">{enr.userId?.email}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300 font-medium">{enr.courseId?.title || 'Unknown Course'}</td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{new Date(enr.enrolledAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <Badge variant={enr.status === 'completed' ? 'success' : 'brand'}>
                        {enr.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
