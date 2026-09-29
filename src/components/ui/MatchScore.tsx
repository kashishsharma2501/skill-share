import React from 'react';
import { cn } from '@/utils/cn';
import { Sparkles } from 'lucide-react';

interface MatchScoreProps {
  score: number;
  size?: 'sm' | 'md';
  showBreakdown?: boolean;
}

export function MatchScore({ score, size = 'sm', showBreakdown = false }: MatchScoreProps) {
  const color =
    score >= 90 ? 'text-green-600 bg-green-50 dark:bg-green-950/30 dark:text-green-400' :
    score >= 75 ? 'text-teal-600 bg-teal-50 dark:bg-teal-950/30 dark:text-teal-400' :
    'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 dark:text-indigo-400';

  if (size === 'md') {
    return (
      <div>
        <div className={cn('inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-sm', color)}>
          <Sparkles className="w-4 h-4" />
          {score}% Match
        </div>
        {showBreakdown && (
          <div className="mt-2 space-y-1">
            {[
              { label: 'Skill match', value: Math.min(score + 3, 100) },
              { label: 'Location match', value: Math.max(score - 5, 70) },
              { label: 'Availability match', value: Math.max(score - 8, 65) },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400 w-32">{item.label}</span>
                <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-1">
                  <div
                    className="bg-indigo-500 h-1 rounded-full transition-all"
                    style={{ width: `${item.value}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-slate-600 dark:text-slate-300 w-8 text-right">{item.value}%</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold', color)}>
      <Sparkles className="w-3 h-3" />
      {score}% match
    </span>
  );
}
