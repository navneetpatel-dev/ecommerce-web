import { Star } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

interface RatingStarsProps {
  value: number
  count?: number
  size?: 'xs' | 'sm' | 'md'
}

export function RatingStars({ value, count, size = 'sm' }: RatingStarsProps) {
  const stars = Math.round(value)
  const starSize = size === 'xs' ? 'h-3 w-3' : size === 'md' ? 'h-5 w-5' : 'h-4 w-4'

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={cn(starSize, i <= stars ? 'fill-accent text-accent' : 'fill-none text-line')}
          />
        ))}
      </div>
      {count !== undefined && (
        <span className={cn('text-ink/50', size === 'xs' ? 'text-[10px]' : 'text-xs')}>({count})</span>
      )}
    </div>
  )
}
