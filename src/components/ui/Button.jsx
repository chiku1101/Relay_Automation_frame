import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Origin UI inspired Button component
 * 100% Tailwind CSS with tactile states and icon slots
 */
export const Button = ({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  onClick,
  className = '',
  type = 'button'
}) => {
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-900/30 border border-blue-400/30',
    secondary: 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700',
    outline: 'bg-transparent hover:bg-slate-800 text-slate-300 border border-slate-800',
    ghost: 'bg-transparent hover:bg-slate-800/60 text-slate-400 hover:text-slate-200',
    danger: 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30'
  }[variant] || 'bg-blue-600 text-white';

  const sizeClasses = {
    sm: 'h-7.5 px-2.5 text-[11px] gap-1.5',
    md: 'h-9 px-3.5 text-xs gap-2',
    lg: 'h-10 px-4 text-sm gap-2.5'
  }[size] || 'h-9 px-3.5 text-xs gap-2';

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-lg font-medium transition-all select-none whitespace-nowrap ${
        disabled || loading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
      } ${sizeClasses} ${variantClasses} ${className}`}
    >
      {loading ? (
        <Loader2 className="size-3.5 animate-spin" />
      ) : Icon && iconPosition === 'left' ? (
        <Icon className="size-3.5 shrink-0" />
      ) : null}
      
      {children && <span>{children}</span>}

      {!loading && Icon && iconPosition === 'right' && (
        <Icon className="size-3.5 shrink-0" />
      )}
    </button>
  );
};
