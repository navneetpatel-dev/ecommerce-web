'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Search } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { formatInr } from '@/features/orders/utils/format'
import { LABELS } from '@/shared/constants/labels'
import { formatLabel } from '@/shared/utils/formatLabel'
import { cn } from '@/shared/utils/cn'
import { SEARCH_SUGGESTION_TYPE, type SearchPanelLayout } from '../constants'
import type { SearchSuggestion } from '../types'

interface SearchBarProps {
  size?: 'lg' | 'sm'
  className?: string
  /** High-contrast treatment when the header sits over a dark surface. */
  onDark?: boolean
  /** Dropdown overlays input (desktop header). Inline flows below (mobile sheet). */
  panelLayout?: SearchPanelLayout
  term: string
  showPanel: boolean
  suggestions?: SearchSuggestion[]
  activeIndex?: number
  isFetching?: boolean
  inputRef?: React.RefObject<HTMLInputElement | null>
  onTermChange: (value: string) => void
  onFocus: () => void
  onBlur: () => void
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void
  onSubmit: (event: React.FormEvent) => void
  onSelect: (suggestion: SearchSuggestion) => void
}

function suggestionTypeLabel(type: SearchSuggestion['type']): string {
  switch (type) {
    case SEARCH_SUGGESTION_TYPE.VENDOR:
      return LABELS.searchSuggestionTypeVendor
    case SEARCH_SUGGESTION_TYPE.CATEGORY:
      return LABELS.searchSuggestionTypeCategory
    case SEARCH_SUGGESTION_TYPE.PRODUCT:
    default:
      return LABELS.searchSuggestionTypeProduct
  }
}

function suggestionMeta(suggestion: SearchSuggestion): string | null {
  if (suggestion.type !== SEARCH_SUGGESTION_TYPE.PRODUCT) return null
  if (suggestion.sku) {
    return formatLabel(LABELS.searchSuggestionSku, { sku: suggestion.sku })
  }
  if (suggestion.basePrice != null) {
    return formatInr(suggestion.basePrice)
  }
  return null
}

function SuggestionImage({ src, alt }: { src?: string; alt: string }) {
  const [unavailable, setUnavailable] = useState(!src)

  if (unavailable) {
    return (
      <span
        aria-hidden
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-line/60 text-[0.625rem] font-medium uppercase text-ink-muted"
      >
        {alt.slice(0, 1)}
      </span>
    )
  }

  return (
    <Image
      src={src!}
      alt=""
      width={32}
      height={32}
      className="h-8 w-8 shrink-0 rounded object-cover"
      onError={() => setUnavailable(true)}
    />
  )
}

const panelTransition = {
  height: { duration: 0.26, ease: [0.16, 1, 0.3, 1] as const },
  opacity: { duration: 0.2, ease: 'easeOut' as const },
}

export function SearchBar({
  size = 'lg',
  className,
  onDark = false,
  panelLayout = 'dropdown',
  term,
  showPanel,
  suggestions,
  activeIndex = -1,
  isFetching = false,
  inputRef,
  onTermChange,
  onFocus,
  onBlur,
  onKeyDown,
  onSubmit,
  onSelect,
}: SearchBarProps) {
  const listId = 'search-suggestions-list'
  const isInline = panelLayout === 'inline'
  const overlayDropdown = !isInline
  const [shellExpanded, setShellExpanded] = useState(false)

  useEffect(() => {
    if (showPanel) setShellExpanded(true)
  }, [showPanel])

  const renderPanelBody = () => {
    if (isFetching && !suggestions?.length) {
      return (
        <div className="min-h-[7.75rem] space-y-2 p-3">
          <div className="h-10 animate-pulse rounded-md bg-line/60" />
          <div className="h-10 animate-pulse rounded-md bg-line/60" />
          <div className="h-10 animate-pulse rounded-md bg-line/60" />
        </div>
      )
    }

    if (!suggestions?.length) {
      return (
        <p className="min-h-[3.25rem] px-4 py-3.5 text-[0.8125rem] text-ink-muted">
          {LABELS.searchAutocompleteEmpty}
        </p>
      )
    }

    return suggestions.map((suggestion, index) => {
      const meta = suggestionMeta(suggestion)
      return (
        <Button
          key={`${suggestion.type}-${suggestion.id}`}
          type="button"
          variant="ghost"
          role="option"
          aria-selected={index === activeIndex}
          id={`${listId}-option-${index}`}
          className={cn(
            'h-12 w-full justify-start gap-3 rounded-none px-4 last:rounded-b-2xl',
            index === activeIndex && 'bg-paper',
          )}
          onMouseDown={(event) => {
            event.preventDefault()
            onSelect(suggestion)
          }}
        >
          <SuggestionImage src={suggestion.imageUrl} alt={suggestion.name} />
          <span className="min-w-0 flex-1 text-left">
            <span className="block truncate text-[0.9375rem] font-medium text-ink">
              {suggestion.name}
            </span>
            {meta ? (
              <span className="block truncate text-[0.8125rem] text-ink-muted">{meta}</span>
            ) : null}
          </span>
          {suggestion.type !== SEARCH_SUGGESTION_TYPE.PRODUCT ? (
            <span className="shrink-0 text-[0.6875rem] font-medium uppercase tracking-wide text-ink-faint">
              {suggestionTypeLabel(suggestion.type)}
            </span>
          ) : null}
        </Button>
      )
    })
  }

  return (
    <div className={cn('relative w-full', className)}>
      {shellExpanded && overlayDropdown ? <div className="h-11 shrink-0" aria-hidden /> : null}

      <div
        className={cn(
          'w-full',
          shellExpanded && overlayDropdown && 'absolute inset-x-0 top-0 z-50',
          shellExpanded &&
            'overflow-hidden rounded-2xl border border-line bg-surface-raised shadow-elevation-2',
        )}
      >
        <form onSubmit={onSubmit} className="relative">
          <Search
            size={size === 'sm' ? 16 : 20}
            className={cn(
              'pointer-events-none absolute left-4 top-1/2 z-[1] -translate-y-1/2',
              shellExpanded || !onDark ? 'text-ink-muted' : 'text-paper/70',
            )}
            aria-hidden
          />
          <Input
            ref={inputRef}
            type="search"
            role="combobox"
            aria-expanded={showPanel}
            aria-controls={showPanel ? listId : undefined}
            aria-activedescendant={
              showPanel && activeIndex >= 0 ? `${listId}-option-${activeIndex}` : undefined
            }
            aria-autocomplete="list"
            value={term}
            onChange={(e) => onTermChange(e.target.value)}
            onFocus={onFocus}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            placeholder={LABELS.searchProductsVendors}
            className={cn(
              'h-11',
              '[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none',
              size === 'sm' ? 'pl-9 text-[0.8125rem]' : 'pl-11',
              shellExpanded
                ? 'rounded-none border-0 bg-transparent text-ink shadow-none placeholder:text-ink-faint focus-visible:border-transparent'
                : cn(
                    'rounded-full',
                    onDark &&
                      'border-paper/25 bg-paper/10 text-paper placeholder:text-paper/55 focus-visible:border-paper/50',
                  ),
            )}
          />
        </form>

        <AnimatePresence initial={false} onExitComplete={() => setShellExpanded(false)}>
          {showPanel ? (
            <motion.div
              key="search-panel"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={panelTransition}
              className="overflow-hidden"
            >
              <div
                id={listId}
                role="listbox"
                aria-label={LABELS.searchSuggestions}
                className={cn(
                  'border-t border-line',
                  isInline
                    ? 'max-h-[min(24rem,calc(85vh-12rem))] overflow-auto'
                    : 'max-h-80 overflow-auto',
                )}
              >
                {renderPanelBody()}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  )
}
