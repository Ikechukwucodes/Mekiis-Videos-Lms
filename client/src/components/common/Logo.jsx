import React from 'react';

/**
 * Reusable Logo Component for Mekiis Videos LMS
 * 
 * Rules:
 * - Light Mode: Mekiis Videos Blue.png (or logo-mark-blue.png for mark)
 * - Dark Mode:  Mekiis Videos white.png (or logo-mark-white.png for mark)
 * 
 * Variants:
 * - 'nav': Default navigation bar logo (Mekiis Videos Blue/white with LMS badge)
 * - 'full': Complete full graphic (Mekiis Videos Blue/white image)
 * - 'mark': Iconic "M" geometric mark only (blue on light, white on dark)
 */
export const Logo = ({
  variant = 'nav',
  size = 'md',
  className = '',
  showBadge = true,
  badgeText = 'LMS'
}) => {
  const fullSizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-14',
    xl: 'h-20'
  };

  const markSizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
    xl: 'h-14 w-14'
  };

  if (variant === 'mark') {
    return (
      <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
        {/* Light mode: Mekiis Videos Blue mark */}
        <img
          src="/logo-mark-blue.png"
          alt="Mekiis Videos Logo"
          className={`${markSizeClasses[size] || 'h-8 w-8'} object-contain block dark:hidden`}
        />
        {/* Dark mode: Mekiis Videos white mark */}
        <img
          src="/logo-mark-white.png"
          alt="Mekiis Videos Logo"
          className={`${markSizeClasses[size] || 'h-8 w-8'} object-contain hidden dark:block`}
        />
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div className={`relative inline-flex items-center justify-center ${className}`}>
        {/* Light mode: Mekiis Videos Blue.png */}
        <img
          src="/Mekiis Videos Blue.png"
          alt="Mekiis Videos"
          className={`${fullSizeClasses[size] || 'h-10'} w-auto object-contain block dark:hidden`}
        />
        {/* Dark mode: Mekiis Videos white.png */}
        <img
          src="/Mekiis Videos white.png"
          alt="Mekiis Videos"
          className={`${fullSizeClasses[size] || 'h-10'} w-auto object-contain hidden dark:block`}
        />
      </div>
    );
  }

  // Default 'nav' variant: Mekiis Videos Blue / white logo with LMS tag
  return (
    <div className={`inline-flex items-center gap-2 sm:gap-2.5 select-none group ${className}`}>
      {/* Light mode: Mekiis Videos Blue */}
      <img
        src="/Mekiis Videos Blue.png"
        alt="Mekiis Videos"
        className="h-11 sm:h-12 w-auto object-contain block dark:hidden group-hover:scale-105 transition-transform duration-200"
      />
      {/* Dark mode: Mekiis Videos white */}
      <img
        src="/Mekiis Videos white.png"
        alt="Mekiis Videos"
        className="h-11 sm:h-12 w-auto object-contain hidden dark:block group-hover:scale-105 transition-transform duration-200"
      />

      {showBadge && (
        <span className="text-brand-600 dark:text-brand-400 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-brand-50 dark:bg-brand-950/70 border border-brand-200/50 dark:border-brand-800/50 rounded-md shrink-0">
          {badgeText}
        </span>
      )}
    </div>
  );
};
