'use client'

import { X } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Slider } from '@/shared/components/ui/slider'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/shared/components/ui/accordion'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group'
import { Label } from '@/shared/components/ui/label'

interface FilterSidebarProps {
  minPrice: number | undefined
  maxPrice: number | undefined
  rating: number | undefined
  onUpdateFilter: (key: string, value: unknown) => void
  onClear: () => void
  className?: string
}

export function FilterSidebar({ minPrice, maxPrice, rating, onUpdateFilter, onClear, className }: FilterSidebarProps) {
  const hasFilters = minPrice !== undefined || maxPrice !== undefined || rating !== undefined

  return (
    <aside className={className ?? "w-60 shrink-0 hidden lg:block"}>
      <div className="space-y-0 sticky top-[88px]">
        <Accordion type="multiple" defaultValue={['price', 'rating']}>
          <AccordionItem value="price">
            <AccordionTrigger>Price Range</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-full h-11 rounded-sm border border-line bg-surface px-4 text-[0.9375rem]"
                    value={minPrice ?? ''}
                    onChange={(e) => onUpdateFilter('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                  />
                  <span className="text-ink-faint text-[0.8125rem]">—</span>
                  <input
                    type="number"
                    placeholder="Max"
                    className="w-full h-11 rounded-sm border border-line bg-surface px-4 text-[0.9375rem]"
                    value={maxPrice ?? ''}
                    onChange={(e) => onUpdateFilter('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="rating">
            <AccordionTrigger>Rating</AccordionTrigger>
            <AccordionContent>
              <RadioGroup
                value={rating?.toString() ?? ''}
                onValueChange={(v) => onUpdateFilter('rating', v ? Number(v) : undefined)}
              >
                {[4, 3, 2, 1].map((r) => (
                  <div key={r} className="flex items-center space-x-2">
                    <RadioGroupItem value={r.toString()} id={`rating-${r}`} />
                    <Label htmlFor={`rating-${r}`} className="text-[0.8125rem] cursor-pointer">
                      {r} stars & up
                    </Label>
                  </div>
                ))}
              </RadioGroup>
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
