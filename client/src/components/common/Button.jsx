import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed select-none';

  const variants = {
    primary:
      'bg-gradient-to-r from-[#2193b0] to-[#17697f] hover:from-[#1b809a] hover:to-[#145b6e] dark:from-[#1f4037] dark:to-[#17697f] dark:hover:from-[#265347] dark:hover:to-[#1c7891] text-white shadow-sm hover:shadow focus:ring-cyan-500 active:scale-[0.98]',
    gradient:
      'bg-gradient-to-r from-[#2193b0] to-[#6dd5ed] hover:from-[#1a7f9a] hover:to-[#55c7e1] dark:from-[#1f4037] dark:to-[#2e7462] hover:dark:to-[#388572] text-white shadow-md shadow-cyan-500/25 active:scale-[0.98]',
    secondary:
      'bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white shadow-sm hover:shadow focus:ring-slate-700 active:scale-[0.98]',
    outline:
      'border border-slate-300 dark:border-slate-700 hover:border-[#2193b0]/60 dark:hover:border-[#99f2c8]/60 bg-white/90 dark:bg-[#09151a]/90 backdrop-blur-sm hover:bg-white dark:hover:bg-[#0c1e24] text-slate-700 dark:text-slate-200 focus:ring-cyan-500 active:scale-[0.98]',
    ghost:
      'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white focus:ring-slate-400',
    danger:
      'bg-rose-600 hover:bg-rose-700 text-white shadow-sm hover:shadow focus:ring-rose-500 active:scale-[0.98]'
  };

  const sizes = {
    sm: 'text-xs px-3 py-2 min-h-11 gap-1.5',
    md: 'text-sm px-4 py-2.5 min-h-11 gap-2',
    lg: 'text-base px-6 py-3.5 min-h-11 gap-2.5'
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
      {!loading && Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
      {children}
      {!loading && Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
    </button>
  );
};
