import React from 'react';
import { cn } from '@/utils/cn';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: { value: number; label: string };
  className?: string;
  accent?: 'indigo' | 'teal' | 'green' | 'amber';
}

const accentClasses = {
  indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400',
  teal: 'bg-teal-50 text-teal-600 dark:bg-teal-950/30 dark:text-teal-400',
  green: 'bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400',
  amber: 'bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400',
};

export function StatCard({ title, value, icon, trend, className, accent = 'indigo' }: StatCardProps) {
  const trendPositive = trend && trend.value > 0;
  const trendNeutral = trend && trend.value === 0;

  return (
    <div className={cn('stat-card', className)}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{title}</p>
        {icon && (
          <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', accentClasses[accent])}>
            {icon}
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-[#0F172A] dark:text-slate-100 tracking-tight">
        {value}
      </div>
      {trend && (
        <div className={cn('flex items-center gap-1 mt-2 text-xs font-medium', trendNeutral ? 'text-slate-400' : trendPositive ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400')}>
          {trendNeutral ? <Minus className="w-3 h-3" /> : trendPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          <span>{trend.label}</span>
        </div>
      )}
    </div>
  );
}
