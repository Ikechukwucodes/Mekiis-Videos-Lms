import React from 'react';
import { Logo } from './Logo.jsx';
import { Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white/85 dark:bg-[#071217]/85 backdrop-blur-md border-t border-white/40 dark:border-teal-900/40 mt-auto py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo variant="nav" />

          <p className="text-xs text-slate-500 dark:text-slate-400 text-center md:text-left">
            Production-grade Learning Management Platform built with pure JavaScript/Node.js, React & MongoDB.
          </p>

          <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
            <span>Powered by</span>
            <span className="font-semibold text-slate-600 dark:text-slate-300">Google Antigravity</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
