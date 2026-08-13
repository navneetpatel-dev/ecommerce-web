'use client'

import { useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { Input } from '@/shared/components/ui/input'
import { LABELS } from '@/shared/constants/labels'
import { cn } from '@/shared/utils/cn'
import { SEARCH_SUGGESTION_TYPE, type SearchPanelLayout } from '../constants'
import type { SearchSuggestion } from '../types'
import { SearchSuggestionRow } from './SearchSuggestionRow'

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

const panelTransition = {
  height: { duration: 0.26, ease: [0.16, 1, 0.3, 1] as const },
  opacity: { duration: 0.2, ease: 'easeOut' as const },
}

const SECTION_ORDER = [
  SEARCH_SUGGESTION_TYPE.PRODUCT,
  SEARCH_SUGGESTION_TYPE.CATEGORY,
  SEARCH_SUGGESTION_TYPE.VENDOR,
] as const

function sectionLabel(type: SearchSuggestion['type']): string {
  switch (type) {
    case SEARCH_SUGGESTION_TYPE.VENDOR:
      return LABELS.searchSuggestionVendors
    case SEARCH_SUGGESTION_TYPE.CATEGORY:
      return LABELS.searchSuggestionCategories
    case SEARCH_SUGGESTION_TYPE.PRODUCT:
    default:
      return LABELS.searchSuggestionProducts
  }
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

  const grouped = useMemo(() => {
    const items = suggestions ?? []
    return SECTION_ORDER.map((type) => ({
      type,
      items: items
        .map((suggestion, index) => ({ suggestion, index }))
        .filter(({ suggestion }) => suggestion.type === type),
    })).filter((section) => section.items.length > 0)
  }, [suggestions])

  const renderPanelBody = () => {
    if (isFetching && !suggestions?.length) {
      return (
        <div className="space-y-2 p-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center gap-3 rounded-lg px-1 py-1">
              <div className="h-11 w-11 shrink-0 animate-pulse rounded-lg bg-line/60" />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-3.5 w-2/3 animate-pulse rounded bg-line/60" />
                <div className="h-3 w-1/3 animate-pulse rounded bg-line/50" />
              </div>
            </div>
          ))}
        </div>
      )
    }

    if (!suggestions?.length) {
      return (
        <div className="flex flex-col items-center px-5 py-8 text-center">
          <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-paper text-ink-faint">
            <Search className="h-4 w-4" strokeWidth={1.5} aria-hidden />
          </span>
          <p className="text-[0.9375rem] font-medium text-ink">{LABELS.searchAutocompleteEmpty}</p>
          <p className="mt-1 max-w-xs text-[0.8125rem] leading-relaxed text-ink-muted">
            {LABELS.searchAutocompleteEmptyHint}
          </p>
        </div>
      )
    }

    return (
      <div className="py-1.5">
        {grouped.map((section, sectionIndex) => (
          <div key={section.type} className={cn(sectionIndex > 0 && 'mt-1 border-t border-line/70 pt-1')}>
            <p className="px-4 pb-1 pt-2 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-ink-faint">
              {sectionLabel(section.type)}
            </p>
            <ul className="px-1.5">
              {section.items.map(({ suggestion, index }) => (
                <li key={`${suggestion.type}-${suggestion.id}`}>
                  <SearchSuggestionRow
                    suggestion={suggestion}
                    active={index === activeIndex}
                    id={`${listId}-option-${index}`}
                    onSelect={onSelect}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    )
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
