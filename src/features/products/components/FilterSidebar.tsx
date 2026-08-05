'use client'

import { X } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/shared/components/ui/accordion'
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group'
import { Label } from '@/shared/components/ui/label'

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
    <aside className={className ?? 'w-60 shrink-0 hidden lg:block'}>
      <div className="space-y-0 sticky top-[88px]">
        <Accordion type="multiple" defaultValue={['price', 'rating']}>
          <AccordionItem value="price">
            <AccordionTrigger>Price Range</AccordionTrigger>
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
                <span className="text-ink-faint text-[0.8125rem]">—</span>
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

          <AccordionItem value="rating">
            <AccordionTrigger>Rating</AccordionTrigger>
            <AccordionContent>
              <RadioGroup
                key={`${idPrefix}-rating-${ratingValue || 'none'}`}
                value={ratingValue}
                onValueChange={(v) => onUpdateFilter('rating', v ? Number(v) : undefined)}
              >
                {[4, 3, 2, 1].map((r) => (
                  <div key={r} className="flex items-center gap-2">
                    <RadioGroupItem value={String(r)} id={`${idPrefix}-rating-${r}`} />
                    <Label
                      htmlFor={`${idPrefix}-rating-${r}`}
                      className="text-[0.8125rem] cursor-pointer font-normal"
                    >
                      {r} stars & up
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              {rating != null && (
                <button
                  type="button"
                  className="mt-3 text-[0.8125rem] text-brand hover:underline"
                  onClick={() => onUpdateFilter('rating', undefined)}
                >
                  Clear rating
                </button>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {hasFilters && (
          <div className="pt-4">
            <Button variant="ghost" size="sm" onClick={onClear}>
              <X size={14} className="mr-1" /> Clear all filters
            </Button>
          </div>
        )}
      </div>
    </aside>
  )
}
