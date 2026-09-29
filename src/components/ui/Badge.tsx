import React from 'react';
import { cn } from '@/utils/cn';
import { Star, Shield, ThumbsUp, Zap, Award } from 'lucide-react';
import type { ProviderBadge } from '@/types';

type BadgeVariant = 'default' | 'indigo' | 'teal' | 'success' | 'warning' | 'danger' | 'slate';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  indigo: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300',
  teal: 'bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300',
  success: 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300',
  warning: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
  danger: 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300',
  slate: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
};

export function Badge({ variant = 'default', children, className, dot }: BadgeProps) {
  return (
    <span className={cn('badge', variantClasses[variant], className)}>
      {dot && (
        <span className={cn('w-1.5 h-1.5 rounded-full', {
          'bg-indigo-500': variant === 'indigo',
          'bg-teal-500': variant === 'teal',
          'bg-green-500': variant === 'success',
          'bg-amber-500': variant === 'warning',
          'bg-red-500': variant === 'danger',
          'bg-slate-400': variant === 'default' || variant === 'slate',
        })} />
      )}
      {children}
    </span>
  );
}

const badgeConfig: Record<ProviderBadge, { label: string; icon: React.ReactNode; className: string }> = {
  top_rated: {
    label: 'Top Rated',
    icon: <Star className="w-3 h-3 fill-current" />,
    className: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
  },
  reliable: {
    label: 'Reliable',
    icon: <Shield className="w-3 h-3" />,
    className: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
  },
  highly_recommended: {
    label: 'Highly Recommended',
    icon: <ThumbsUp className="w-3 h-3" />,
    className: 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300',
  },
  new_provider: {
    label: 'New Provider',
    icon: <Zap className="w-3 h-3" />,
    className: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300',
  },
  expert: {
    label: 'Expert',
    icon: <Award className="w-3 h-3" />,
    className: 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300',
  },
};

export function ProviderBadgeChip({ badge }: { badge: ProviderBadge }) {
  const config = badgeConfig[badge];
  return (
    <span className={cn('badge', config.className)}>
      {config.icon}
      {config.label}
    </span>
  );
}

interface StatusBadgeProps {
  status: string;
}

const statusConfig: Record<string, { label: string; variant: BadgeVariant; dot?: boolean }> = {
  pending: { label: 'Pending', variant: 'warning', dot: true },
  accepted: { label: 'Confirmed', variant: 'success', dot: true },
  completed: { label: 'Completed', variant: 'teal', dot: true },
  cancelled: { label: 'Cancelled', variant: 'danger', dot: true },
  declined: { label: 'Declined', variant: 'danger', dot: true },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, variant: 'default' as BadgeVariant };
  return (
    <Badge variant={config.variant} dot={config.dot}>
      {config.label}
    </Badge>
  );
}
