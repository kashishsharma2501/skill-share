import React from 'react';
import { cn } from '@/utils/cn';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-4 text-center', className)}>
      {icon && (
        <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4 text-slate-400">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-[#0F172A] dark:text-slate-100 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">{description}</p>
      )}
      {action && (
        <Button variant="primary" size="sm" className="mt-4" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

export function LoadingState({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      <p className="text-sm text-slate-500">{message}</p>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="card p-5 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="skeleton w-12 h-12 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-1/3 rounded" />
          <div className="skeleton h-3 w-1/2 rounded" />
          <div className="skeleton h-3 w-2/3 rounded" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="skeleton h-3 w-full rounded" />
        <div className="skeleton h-3 w-3/4 rounded" />
      </div>
    </div>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
