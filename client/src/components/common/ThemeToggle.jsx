import React from 'react';
import { useTheme } from '../../context/ThemeContext.jsx';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle = ({ className = '', size = 'md' }) => {
  const { isDark, toggleTheme } = useTheme();

  const buttonSizes = {
    sm: 'w-8 h-8 p-1.5',
    md: 'w-9 h-9 p-2',
    lg: 'w-10 h-10 p-2.5'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleTheme(e);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
      data-testid="theme-toggle"
      data-theme-current={isDark ? 'dark' : 'light'}
      className={`rounded-xl border transition-all duration-200 flex items-center justify-center select-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500/40 ${
        isDark
          ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700 hover:text-amber-300 shadow-sm'
          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 shadow-sm'
      } ${buttonSizes[size] || buttonSizes.md} ${className}`}
    >
      {isDark ? (
        <Sun className={`${iconSizes[size] || iconSizes.md} pointer-events-none transition-transform rotate-0 scale-100`} />
      ) : (
        <Moon className={`${iconSizes[size] || iconSizes.md} pointer-events-none transition-transform -rotate-90 scale-100`} />
      )}
    </button>
  );
};
