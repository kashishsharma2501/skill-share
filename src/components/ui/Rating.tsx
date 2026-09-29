import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/utils/cn';

interface RatingDisplayProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}

export function RatingDisplay({ rating, reviewCount, size = 'sm', showCount = true }: RatingDisplayProps) {
  const starSize = size === 'sm' ? 'w-3.5 h-3.5' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5';
  const textSize = size === 'sm' ? 'text-sm' : size === 'md' ? 'text-base' : 'text-lg';

  return (
    <div className="flex items-center gap-1">
      <Star className={cn(starSize, 'fill-amber-400 text-amber-400')} />
      <span className={cn('font-semibold text-[#0F172A] dark:text-slate-100', textSize)}>
        {rating.toFixed(1)}
      </span>
      {showCount && reviewCount !== undefined && (
        <span className={cn('text-slate-500 dark:text-slate-400', size === 'sm' ? 'text-xs' : 'text-sm')}>
          ({reviewCount})
        </span>
      )}
    </div>
  );
}

interface StarRatingInputProps {
  value: number;
  onChange: (rating: number) => void;
  size?: 'md' | 'lg';
}

export function StarRatingInput({ value, onChange, size = 'lg' }: StarRatingInputProps) {
  const [hovered, setHovered] = React.useState(0);
  const starSize = size === 'lg' ? 'w-8 h-8' : 'w-6 h-6';

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="focus:outline-none transition-transform hover:scale-110"
          aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
        >
          <Star
            className={cn(
              starSize,
              'transition-colors',
              (hovered || value) >= star
                ? 'fill-amber-400 text-amber-400'
                : 'fill-none text-slate-300 dark:text-slate-600'
            )}
          />
        </button>
      ))}
    </div>
  );
}
