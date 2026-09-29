import React from 'react';
import { cn } from '@/utils/cn';
import { getInitials } from '@/utils/format';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface AvatarProps {
  src?: string;
  name: string;
  size?: AvatarSize;
  className?: string;
  online?: boolean;
}

const sizeClasses: Record<AvatarSize, string> = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
  '2xl': 'w-20 h-20 text-xl',
};

const onlineDotSize: Record<AvatarSize, string> = {
  xs: 'w-1.5 h-1.5 bottom-0 right-0',
  sm: 'w-2 h-2 bottom-0 right-0',
  md: 'w-2.5 h-2.5 bottom-0 right-0',
  lg: 'w-3 h-3 bottom-0.5 right-0.5',
  xl: 'w-3.5 h-3.5 bottom-1 right-1',
  '2xl': 'w-4 h-4 bottom-1 right-1',
};

const colorSeeds = [
  'bg-indigo-100 text-indigo-700',
  'bg-teal-100 text-teal-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-violet-100 text-violet-700',
  'bg-sky-100 text-sky-700',
];

function getColorForName(name: string): string {
  const index = name.charCodeAt(0) % colorSeeds.length;
  return colorSeeds[index];
}

export function Avatar({ src, name, size = 'md', className, online }: AvatarProps) {
  const [imgError, setImgError] = React.useState(false);

  return (
    <div className={cn('relative inline-flex shrink-0', className)}>
      {src && !imgError ? (
        <img
          src={src}
          alt={name}
          onError={() => setImgError(true)}
          className={cn('rounded-full object-cover', sizeClasses[size])}
        />
      ) : (
        <div
          className={cn(
            'rounded-full flex items-center justify-center font-semibold',
            sizeClasses[size],
            getColorForName(name)
          )}
        >
          {getInitials(name)}
        </div>
      )}
      {online !== undefined && (
        <span
          className={cn(
            'absolute rounded-full border-2 border-white dark:border-slate-900',
            onlineDotSize[size],
            online ? 'bg-green-500' : 'bg-slate-400'
          )}
        />
      )}
    </div>
  );
}
