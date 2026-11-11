import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar.jsx';
import { Footer } from '../components/common/Footer.jsx';

export const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white/20 via-transparent to-white/10 dark:from-[#081217]/60 dark:via-[#102624]/40 dark:to-[#081217]/60 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
