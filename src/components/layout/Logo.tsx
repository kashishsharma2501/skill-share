import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  light?: boolean;
}

export function Logo({ size = 'md', className, light }: LogoProps) {
  const textSize = size === 'sm' ? 'text-base' : size === 'md' ? 'text-lg' : 'text-2xl';
  const iconSize = size === 'sm' ? 'w-6 h-6' : size === 'md' ? 'w-8 h-8' : 'w-10 h-10';

  return (
    <Link
      to="/"
      className={cn('inline-flex items-center gap-2 no-underline select-none', className)}
      aria-label="SkillShare Local — Home"
    >
      {/* Icon mark */}
      <div className={cn('relative shrink-0 rounded-lg bg-indigo-600 flex items-center justify-center', iconSize)}>
        {/* S + connection nodes */}
        <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" aria-hidden="true">
          <circle cx="12" cy="6" r="2.5" fill="white" opacity="0.9" />
          <circle cx="6" cy="17" r="2.5" fill="white" opacity="0.75" />
          <circle cx="18" cy="17" r="2.5" fill="white" opacity="0.75" />
          <line x1="12" y1="8.5" x2="6" y2="14.5" stroke="white" strokeWidth="1.5" strokeOpacity="0.6" strokeLinecap="round" />
          <line x1="12" y1="8.5" x2="18" y2="14.5" stroke="white" strokeWidth="1.5" strokeOpacity="0.6" strokeLinecap="round" />
          <line x1="8.5" y1="17" x2="15.5" y2="17" stroke="white" strokeWidth="1.5" strokeOpacity="0.4" strokeLinecap="round" />
        </svg>
      </div>

      {/* Wordmark */}
      <div className="flex flex-col leading-none">
        <span className={cn('font-bold tracking-tight', textSize, light ? 'text-white' : 'text-[#0B1220] dark:text-white')}>
          SkillShare
          <span className={cn('font-normal', light ? 'text-indigo-300' : 'text-indigo-600 dark:text-indigo-400')}> Local</span>
        </span>
        {size !== 'sm' && (
          <span className={cn('text-[10px] font-medium tracking-widest uppercase', light ? 'text-white/50' : 'text-slate-400 dark:text-slate-500')}>
            Community Skills
          </span>
        )}
      </div>
    </Link>
  );
}
