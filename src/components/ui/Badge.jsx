import React from 'react';

/**
 * Origin UI inspired Badge Component
 * 100% Tailwind CSS with dual-tone borders, glowing micro-pulsers, and compact typography
 */
export const Badge = ({ 
  children, 
  variant = 'neutral', 
  size = 'md',
  pulse = false, 
  className = '',
  icon: Icon
}) => {
  const variantClasses = {
    neutral: 'bg-slate-900/80 text-slate-400 border-slate-700/80',
    primary: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
    success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    danger: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    purple: 'bg-purple-500/15 text-purple-400 border-purple-500/30'
  }[variant] || 'bg-slate-900/80 text-slate-400 border-slate-700/80';

  const dotColor = {
    neutral: 'bg-slate-400',
    primary: 'bg-sky-400',
    success: 'bg-emerald-400',
    warning: 'bg-amber-400',
    danger: 'bg-rose-400',
    purple: 'bg-purple-400'
  }[variant] || 'bg-slate-400';

  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-[9.5px]',
    md: 'px-2 py-0.5 text-[10.5px]',
    lg: 'px-2.5 py-1 text-[11.5px]'
  }[size] || 'px-2 py-0.5 text-[10.5px]';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded font-mono font-bold uppercase tracking-wider border select-none ${sizeClasses} ${variantClasses} ${className}`}>
      {pulse ? (
        <span className="relative flex size-1.5">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotColor}`} />
          <span className={`relative inline-flex rounded-full size-1.5 ${dotColor}`} />
        </span>
      ) : Icon ? (
        <Icon className="size-3 shrink-0" />
      ) : null}
      <span>{children}</span>
    </span>
  );
};
