import React from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Navbar } from '../components/common/Navbar.jsx';
import { LayoutDashboard, BookMarked, UserCircle } from 'lucide-react';

export const StudentLayout = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const tabs = [
    { name: 'Dashboard Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Enrolled Courses', path: '/dashboard/courses', icon: BookMarked },
    { name: 'My Profile', path: '/dashboard/profile', icon: UserCircle }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white/20 via-transparent to-white/10 dark:from-[#081217]/60 dark:via-[#102624]/40 dark:to-[#081217]/60 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />

      {/* Student Portal Navigation Bar */}
      <div className="bg-white/85 dark:bg-[#071217]/85 backdrop-blur-md border-b border-white/40 dark:border-teal-900/40 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto py-3">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = location.pathname === tab.path;
              return (
                <Link
                  key={tab.path}
                  to={tab.path}
                  className={`inline-flex items-center gap-2 py-2 px-1 text-sm font-semibold border-b-2 transition whitespace-nowrap ${
                    isActive
                      ? 'border-[#2193b0] dark:border-[#99f2c8] text-[#17697f] dark:text-[#99f2c8]'
                      : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};
