import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { Button } from './Button.jsx';
import { Badge } from './Badge.jsx';
import { ThemeToggle } from './ThemeToggle.jsx';
import { Logo } from './Logo.jsx';
import {
  BookOpen,
  LayoutDashboard,
  Shield,
  LogOut,
  User,
  Compass
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, isStudent, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/85 dark:bg-[#071217]/85 backdrop-blur-md border-b border-white/40 dark:border-teal-900/40 shadow-sm shadow-cyan-900/5 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center">
          <Logo variant="nav" />
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            to="/courses"
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition ${
              isActive('/courses')
                ? 'bg-cyan-50 dark:bg-teal-950/60 text-[#17697f] dark:text-[#99f2c8]'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50/80 dark:hover:bg-slate-800/60'
            }`}
          >
            <Compass className="w-4 h-4" /> Browse Catalog
          </Link>

          {isAuthenticated && (
            <Link
              to="/dashboard"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition ${
                isActive('/dashboard')
                  ? 'bg-cyan-50 dark:bg-teal-950/60 text-[#17697f] dark:text-[#99f2c8]'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50/80 dark:hover:bg-slate-800/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" /> Student Portal
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/admin"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition ${
                location.pathname.startsWith('/admin')
                  ? 'bg-brand-50 dark:bg-brand-950/70 text-brand-700 dark:text-brand-300 border border-brand-200/60 dark:border-brand-800/60'
                  : 'text-brand-600 dark:text-brand-400 hover:bg-brand-50/50 dark:hover:bg-slate-800'
              }`}
            >
              <Shield className="w-4 h-4" /> Admin Studio
            </Link>
          )}
        </nav>

        {/* Right Section: Theme Toggle & Auth Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Light / Dark Mode Toggle */}
          <ThemeToggle />

          {isAuthenticated ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors">
                <div className="w-7 h-7 rounded-lg bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300 flex items-center justify-center font-bold text-xs uppercase">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                    {user?.name}
                  </div>
                  <Badge variant={user?.role === 'ADMIN' ? 'brand' : 'default'} size="sm">
                    {user?.role}
                  </Badge>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                title="Logout"
                icon={LogOut}
                className="text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
              >
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
