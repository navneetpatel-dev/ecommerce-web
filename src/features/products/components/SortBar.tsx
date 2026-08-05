'use client'

import { Columns2 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { Button } from '@/shared/components/ui/button'
import { cn } from '@/shared/utils/cn'

const SORT_OPTIONS = [
  { value: 'trending', label: 'Trending' },
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
] as const

interface SortBarProps {
  sort: string | undefined
  totalProducts: number | undefined
  isFetching: boolean
  onSortChange: (value: string) => void
  compareMode?: boolean
  onToggleCompare?: () => void
  className?: string
}

export function SortBar({
  sort,
  totalProducts,
  isFetching,
  onSortChange,
  compareMode = false,
  onToggleCompare,
  className,
}: SortBarProps) {
  const countLabel =
    totalProducts !== undefined
      ? `${totalProducts.toLocaleString('en-IN')} ${totalProducts === 1 ? 'product' : 'products'}`
      : isFetching
        ? 'Updating…'
        : 'Browse collection'

  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-3 border-b border-line-strong pb-4 mb-6',
        className
      )}
    >
      <p className="text-[0.8125rem] tracking-wide text-ink-muted tabular-nums">{countLabel}</p>

      <div className="flex items-center gap-2">
        <Select
          value={sort || 'trending'}
          onValueChange={onSortChange}
        >
          <SelectTrigger
            aria-label="Sort products"
            className="h-9 w-[11.5rem] rounded-md border-line bg-surface text-[0.8125rem]"
          >
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {onToggleCompare ? (
          <Button
            type="button"
            variant={compareMode ? 'default' : 'secondary'}
            size="sm"
            className="hidden lg:inline-flex gap-1.5"
            onClick={onToggleCompare}
            aria-pressed={compareMode}
          >
            <Columns2 size={14} strokeWidth={1.75} aria-hidden />
            Compare
          </Button>
        ) : null}
      </div>
    </div>
  )
}
