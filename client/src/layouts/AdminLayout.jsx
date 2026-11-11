import React from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Navbar } from '../components/common/Navbar.jsx';
import {
  BarChart3,
  BookPlus,
  Users,
  Award,
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';

export const AdminLayout = () => {
  const { user, isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  // Strict role check
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const navItems = [
    { name: 'Analytics & Overview', path: '/admin', icon: BarChart3, exact: true },
    { name: 'Course Management', path: '/admin/courses', icon: BookPlus },
    { name: 'Users & Progress', path: '/admin/users', icon: Users },
    { name: 'Enrollments Roster', path: '/admin/enrollments', icon: Award }
  ];

  const isNavActive = (item) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white/20 via-transparent to-white/10 dark:from-[#081217]/60 dark:via-[#102624]/40 dark:to-[#081217]/60 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {/* Admin Header Badge */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/90 dark:bg-[#071318]/90 backdrop-blur-md p-5 rounded-2xl border border-white/60 dark:border-teal-900/40 shadow-sm transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-100/70 dark:bg-teal-950/70 text-[#17697f] dark:text-[#99f2c8] flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Admin Control Center</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Manage courses, curricula, students, and learning analytics</p>
            </div>
          </div>
          <Link
            to="/courses"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3 py-1.5 rounded-lg border border-slate-200/80 dark:border-teal-900/60 hover:bg-white/80 dark:hover:bg-[#0c1e24] transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Public Catalog
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Admin Navigation Sidebar */}
          <aside className="lg:col-span-3 bg-white/90 dark:bg-[#071318]/90 backdrop-blur-md p-3 rounded-2xl border border-white/60 dark:border-teal-900/40 shadow-sm space-y-1 transition-colors">
            <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Management
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isNavActive(item);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                    active
                      ? 'bg-gradient-to-r from-[#2193b0] to-[#17697f] dark:from-[#1f4037] dark:to-[#17697f] text-white dark:text-[#99f2c8] shadow-sm shadow-cyan-900/20'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-[#0c1e24]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-white dark:text-[#99f2c8]' : 'text-slate-400 dark:text-slate-500'}`} />
                  {item.name}
                </Link>
              );
            })}
          </aside>

          {/* Admin Main Content */}
          <section className="lg:col-span-9">
            <Outlet />
          </section>
        </div>
      </div>
    </div>
  );
};
