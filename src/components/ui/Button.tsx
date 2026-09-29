import React from 'react';
import { cn } from '@/utils/cn';
import { Loader2 } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'teal' | 'outline';
type Size = 'xs' | 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow focus:ring-indigo-500/30',
  secondary: 'bg-white dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 text-[#0F172A] dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700 focus:ring-indigo-500/20',
  ghost: 'text-slate-600 dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 focus:ring-indigo-500/20',
  danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm focus:ring-red-500/30',
  teal: 'bg-teal-700 hover:bg-teal-800 text-white shadow-sm focus:ring-teal-500/30',
  outline: 'border border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-500 focus:ring-indigo-500/20',
};

const sizeClasses: Record<Size, string> = {
  xs: 'px-2.5 py-1.5 text-xs gap-1',
  sm: 'px-3.5 py-2 text-sm gap-1.5',
  md: 'px-5 py-2.5 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, leftIcon, rightIcon, children, className, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150',
          'focus:outline-none focus:ring-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : leftIcon ? (
          leftIcon
        ) : null}
        {children}
        {!loading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
