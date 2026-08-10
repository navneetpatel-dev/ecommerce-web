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
import { LABELS } from '@/shared/constants/labels'
import { formatLabel } from '@/shared/utils/formatLabel'
import { cn } from '@/shared/utils/cn'

const SORT_OPTIONS = [
  { value: 'trending', labelKey: 'sortTrending' as const },
  { value: 'newest', labelKey: 'sortNewest' as const },
  { value: 'price_asc', labelKey: 'sortPriceLowHigh' as const },
  { value: 'price_desc', labelKey: 'sortPriceHighLow' as const },
  { value: 'rating', labelKey: 'sortTopRated' as const },
]

interface SortBarProps {
  sort: string | undefined
  totalProducts: number | undefined
  isFetching: boolean
  onSortChange: (value: string) => void
  compareMode?: boolean
  onToggleCompare?: () => void
  /** Hide desktop sort control on small screens when a mobile Sort sheet exists. */
  hideSortOnMobile?: boolean
  className?: string
}

export function SortBar({
  sort,
  totalProducts,
  isFetching,
  onSortChange,
  compareMode = false,
  onToggleCompare,
  hideSortOnMobile = false,
  className,
}: SortBarProps) {
  const countLabel =
    totalProducts !== undefined
      ? formatLabel(
          totalProducts === 1 ? LABELS.productCountSingular : LABELS.productCountPlural,
          { count: totalProducts.toLocaleString('en-IN') },
        )
      : isFetching
        ? LABELS.updatingEllipsis
        : LABELS.browseCollection

  return (
    <div
      className={cn(
        'mb-6 flex flex-wrap items-center justify-between gap-2 border-b border-line pb-4 sm:gap-3',
        className,
      )}
    >
      <p className="text-[0.8125rem] tracking-wide text-ink-muted tabular-nums">{countLabel}</p>

      <div className="flex items-center gap-2">
        <Select value={sort || 'trending'} onValueChange={onSortChange}>
          <SelectTrigger
            aria-label={LABELS.sort}
            className={cn(
              'w-[11.5rem] rounded-md text-[0.8125rem] sm:text-[0.875rem]',
              hideSortOnMobile && 'hidden xl:flex',
            )}
          >
            <SelectValue placeholder={LABELS.sort} />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {LABELS[option.labelKey]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {onToggleCompare ? (
          <Button
            type="button"
            variant={compareMode ? 'default' : 'secondary'}
            size="sm"
            className="hidden gap-1.5 xl:inline-flex"
            onClick={onToggleCompare}
            aria-pressed={compareMode}
          >
            <Columns2 size={14} strokeWidth={1.75} aria-hidden />
            {LABELS.compare}
          </Button>
        ) : null}
      </div>
    </div>
  )
}
