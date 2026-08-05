'use client'

import { X } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/shared/components/ui/accordion'
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group'
import { Label } from '@/shared/components/ui/label'
import { TextEyebrow } from '@/shared/components/TextEyebrow'
import { cn } from '@/shared/utils/cn'

interface FilterSidebarProps {
  minPrice: number | undefined
  maxPrice: number | undefined
  rating: number | undefined
  onUpdateFilter: (key: string, value: unknown) => void
  onClear: () => void
  className?: string
  /** Unique prefix so desktop + mobile instances don't share radio/input ids */
  idPrefix?: string
}

export function FilterSidebar({
  minPrice,
  maxPrice,
  rating,
  onUpdateFilter,
  onClear,
  className,
  idPrefix = 'filters',
}: FilterSidebarProps) {
  const hasFilters = minPrice !== undefined || maxPrice !== undefined || rating !== undefined
  const ratingValue = rating != null ? String(rating) : ''

  return (
    <aside className={cn(className ?? 'hidden w-64 shrink-0 lg:block')}>
      <div className="sticky top-[88px] space-y-5">
        <div className="flex items-end justify-between gap-3 border-b border-line-strong pb-3">
          <div>
            <TextEyebrow className="mb-1">Refine</TextEyebrow>
            <h2 className="text-[1.0625rem] font-semibold text-ink">Filters</h2>
          </div>
          {hasFilters ? (
            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center gap-1 text-[0.75rem] font-medium text-brand transition-colors hover:text-brand-hover"
            >
              <X size={12} strokeWidth={2} aria-hidden />
              Clear
            </button>
          ) : null}
        </div>

        <Accordion type="multiple" defaultValue={['price', 'rating']}>
          <AccordionItem value="price" className="border-line-strong">
            <AccordionTrigger>Price</AccordionTrigger>
            <AccordionContent>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  inputMode="numeric"
                  placeholder="Min"
                  aria-label="Minimum price"
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  value={minPrice ?? ''}
                  onChange={(e) =>
                    onUpdateFilter('minPrice', e.target.value === '' ? undefined : Number(e.target.value))
                  }
                />
                <span className="text-[0.8125rem] text-ink-faint">—</span>
                <Input
                  type="number"
                  inputMode="numeric"
                  placeholder="Max"
                  aria-label="Maximum price"
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  value={maxPrice ?? ''}
                  onChange={(e) =>
                    onUpdateFilter('maxPrice', e.target.value === '' ? undefined : Number(e.target.value))
                  }
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="rating" className="border-line-strong">
            <AccordionTrigger>Rating</AccordionTrigger>
            <AccordionContent>
              <RadioGroup
                key={`${idPrefix}-rating-${ratingValue || 'none'}`}
                value={ratingValue}
                onValueChange={(v) => onUpdateFilter('rating', v ? Number(v) : undefined)}
                className="gap-2.5"
              >
                {[4, 3, 2, 1].map((r) => (
                  <div key={r} className="flex items-center gap-2.5">
                    <RadioGroupItem value={String(r)} id={`${idPrefix}-rating-${r}`} />
                    <Label
                      htmlFor={`${idPrefix}-rating-${r}`}
                      className="cursor-pointer text-[0.8125rem] font-normal text-ink"
                    >
                      {r}+ stars
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              {rating != null ? (
                <button
                  type="button"
                  className="mt-3 text-[0.8125rem] font-medium text-brand transition-colors hover:text-brand-hover"
                  onClick={() => onUpdateFilter('rating', undefined)}
                >
                  Clear rating
                </button>
              ) : null}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </aside>
  )
}
