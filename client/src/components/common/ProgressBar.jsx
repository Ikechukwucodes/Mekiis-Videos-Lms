import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export const ProgressBar = ({
  percentage = 0,
  showLabel = true,
  size = 'md',
  className = '',
  showSuccess = true
}) => {
  const clamped = Math.min(100, Math.max(0, Math.round(percentage)));
  const isComplete = clamped === 100;

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs font-semibold mb-1.5 text-slate-700 dark:text-slate-300">
          <span className="flex items-center gap-1.5">
            {isComplete && showSuccess ? (
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Completed
              </span>
            ) : (
              <span>Progress</span>
            )}
          </span>
          <span className="text-slate-500 dark:text-slate-400 tabular-nums">{clamped}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden ${heights[size] || heights.md}`}>
        <div
          className={`h-full transition-all duration-500 rounded-full ${
            isComplete
              ? 'bg-emerald-500'
              : 'bg-gradient-to-r from-[#2193b0] via-[#4facfe] to-[#6dd5ed] dark:from-[#1f4037] dark:via-[#2e7462] dark:to-[#99f2c8]'
          }`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
