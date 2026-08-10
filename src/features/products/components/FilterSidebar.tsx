'use client'

import { X } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { CheckboxField } from '@/shared/components/CheckboxField'
import { NumberInput } from '@/shared/components/NumberInput'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/shared/components/ui/accordion'
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group'
import { Label } from '@/shared/components/ui/label'
import { TextEyebrow } from '@/shared/components/TextEyebrow'
import { cn } from '@/shared/utils/cn'
import { LABELS } from '@/shared/constants/labels'
import { formatLabel } from '@/shared/utils/formatLabel'
import type { CategoryFacet } from '@/shared/api/types'

interface FilterSidebarProps {
  minPrice: number | undefined
  maxPrice: number | undefined
  rating: number | undefined
  onUpdateFilter: (key: string, value: unknown) => void
  onClear: () => void
  className?: string
  /** Unique prefix so desktop + mobile instances don't share radio/input ids */
  idPrefix?: string
  facets?: CategoryFacet[]
  facetSelections?: Record<string, string[]>
  onToggleFacet?: (filterKey: string, value: string) => void
}

export function FilterSidebar({
  minPrice,
  maxPrice,
  rating,
  onUpdateFilter,
  onClear,
  className,
  idPrefix = 'filters',
  facets = [],
  facetSelections = {},
  onToggleFacet,
}: FilterSidebarProps) {
  const hasFacetSelections = Object.values(facetSelections).some((values) => values.length > 0)
  const hasFilters =
    minPrice !== undefined || maxPrice !== undefined || rating !== undefined || hasFacetSelections
  const ratingValue = rating != null ? String(rating) : ''
  const defaultOpen = ['price', 'rating', ...facets.map((facet) => facet.filterKey)]

  return (
    <aside className={cn(className ?? 'hidden w-64 shrink-0 xl:block')}>
      <div className="sticky top-[88px] space-y-5">
        <div className="flex items-end justify-between gap-3 border-b border-line pb-3">
          <div>
            <TextEyebrow className="mb-1">{LABELS.refine}</TextEyebrow>
            <h2 className="text-[1.0625rem] font-semibold text-ink">{LABELS.filters}</h2>
          </div>
          {hasFilters ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="h-auto min-h-0 max-h-none gap-1 px-2 py-1 text-[0.75rem] font-medium text-brand hover:bg-transparent hover:text-brand-hover"
            >
              <X size={12} strokeWidth={2} aria-hidden />
              {LABELS.clearFacetFilters}
            </Button>
          ) : null}
        </div>

        <Accordion key={facets.map((f) => f.id).join('-') || 'base'} type="multiple" defaultValue={defaultOpen}>
          <AccordionItem value="price">
            <AccordionTrigger>{LABELS.price}</AccordionTrigger>
            <AccordionContent>
              <div className="flex items-center gap-2">
                <NumberInput
                  showSteppers={false}
                  min={0}
                  placeholder={LABELS.minPricePlaceholder}
                  aria-label={LABELS.minimumPrice}
                  prefix="₹"
                  value={minPrice}
                  onChange={(value) => onUpdateFilter('minPrice', value)}
                />
                <span className="text-[0.8125rem] text-ink-faint">—</span>
                <NumberInput
                  showSteppers={false}
                  min={0}
                  placeholder={LABELS.maxPricePlaceholder}
                  aria-label={LABELS.maximumPrice}
                  prefix="₹"
                  value={maxPrice}
                  onChange={(value) => onUpdateFilter('maxPrice', value)}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {facets.map((facet) => {
            const selected = new Set(facetSelections[facet.filterKey] ?? [])
            return (
              <AccordionItem key={facet.id} value={facet.filterKey}>
                <AccordionTrigger>{facet.name}</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2">
                    {facet.options.map((option) => {
                      const id = `${idPrefix}-${facet.filterKey}-${option.value}`
                      const checked = selected.has(option.value)
                      return (
                        <li key={option.value}>
                          <CheckboxField
                            id={id}
                            checked={checked}
                            disabled={option.disabled && !checked}
                            onCheckedChange={() => onToggleFacet?.(facet.filterKey, option.value)}
                            className={cn(
                              'w-full gap-2.5 text-[0.8125rem]',
                              option.disabled && !checked && 'text-ink-faint',
                            )}
                            labelClassName="flex items-center justify-between gap-2"
                            label={
                              <>
                                <span className="min-w-0 truncate capitalize">{option.value}</span>
                                <span className="shrink-0 tabular-nums text-ink-faint">{option.count}</span>
                              </>
                            }
                          />
                        </li>
                      )
                    })}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            )
          })}

          <AccordionItem value="rating">
            <AccordionTrigger>{LABELS.rating}</AccordionTrigger>
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
                      {formatLabel(LABELS.starsAndUp, { count: r })}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              {rating != null ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="mt-3 h-auto min-h-0 max-h-none px-0 py-0 text-[0.8125rem] font-medium text-brand hover:bg-transparent hover:text-brand-hover"
                  onClick={() => onUpdateFilter('rating', undefined)}
                >
                  {LABELS.clearRating}
                </Button>
              ) : null}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </aside>
  )
}
