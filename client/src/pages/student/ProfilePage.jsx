import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { progressService } from '../../services/progressService.js';
import { Button } from '../../components/common/Button.jsx';
import { Badge } from '../../components/common/Badge.jsx';
import { User, Mail, Calendar, Shield, Award, BookOpen, LogOut } from 'lucide-react';

export const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    progressService.getStudentStats().then(setStats).catch(() => {});
  }, []);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Student Profile</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Manage your account information and learning achievements.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 space-y-6 transition-colors">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white text-2xl font-black flex items-center justify-center shadow-lg">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user?.name}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
              <Mail className="w-3.5 h-3.5" /> {user?.email}
            </p>
            <div className="mt-2">
              <Badge variant={user?.role === 'ADMIN' ? 'brand' : 'default'}>{user?.role}</Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl">
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-400">Total Enrolled</span>
            <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">{stats?.totalEnrolled || 0} Courses</div>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl">
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-400">Completed Courses</span>
            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{stats?.completedCoursesCount || 0} Courses</div>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl">
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-400">Average Progress</span>
            <div className="text-xl font-bold text-brand-600 dark:text-brand-400 mt-1">{stats?.averageCompletion || 0}%</div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
          </span>

          <Button variant="danger" size="sm" onClick={logout} icon={LogOut}>
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};
