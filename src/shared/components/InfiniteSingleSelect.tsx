'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Input } from '@/shared/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover'
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group'
import { LABELS } from '@/shared/constants/labels'
import { DEFAULT_PAGE_LIMIT } from '@/shared/constants/pagination'
import { cn } from '@/shared/utils/cn'

export type InfiniteSingleSelectOption = {
  id: string
  label: string
}

export type InfiniteSingleSelectPageQuery = {
  page: number
  limit: number
  search?: string
}

export type InfiniteSingleSelectPageResult = {
  items: InfiniteSingleSelectOption[]
  page: number
  totalPages: number
  total: number
}

export interface InfiniteSingleSelectProps {
  value: string
  onChange: (id: string) => void
  /** Fetch one page. Must return server pagination meta so infinite scroll can continue. */
  fetchPage: (query: InfiniteSingleSelectPageQuery) => Promise<InfiniteSingleSelectPageResult>
  /**
   * When this changes, the list resets and reloads from page 1
   * (e.g. permission scope).
   */
  resetKey?: string | number | null
  /** Keep a selected option visible even if they are not in loaded pages. */
  pinnedOption?: InfiniteSingleSelectOption | null
  allowNone?: boolean
  noneValue?: string
  noneLabel?: string
  /** Closed-trigger label when nothing is selected. */
  placeholder?: string
  searchPlaceholder?: string
  /** When false, hides the search field (for APIs without search). Default true. */
  searchable?: boolean
  emptyMessage?: string
  error?: boolean
  disabled?: boolean
  pageSize?: number
  className?: string
  listClassName?: string
  idPrefix?: string
}

function mergeUnique(
  existing: InfiniteSingleSelectOption[],
  incoming: InfiniteSingleSelectOption[],
): InfiniteSingleSelectOption[] {
  if (incoming.length === 0) return existing
  const seen = new Set(existing.map((item) => item.id))
  const next = [...existing]
  for (const item of incoming) {
    if (seen.has(item.id)) continue
    seen.add(item.id)
    next.push(item)
  }
  return next
}

export function InfiniteSingleSelect({
  value,
  onChange,
  fetchPage,
  resetKey = null,
  pinnedOption = null,
  allowNone = false,
  noneValue = '__none__',
  noneLabel = LABELS.noneSelected,
  placeholder = LABELS.search,
  searchPlaceholder = LABELS.search,
  searchable = true,
  emptyMessage = LABELS.noResults,
  error = false,
  disabled = false,
  pageSize = DEFAULT_PAGE_LIMIT,
  className,
  listClassName,
  idPrefix = 'infinite-single-select',
}: InfiniteSingleSelectProps) {
  const listboxId = useId()
  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState<InfiniteSingleSelectOption[]>([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [initialLoading, setInitialLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [loadError, setLoadError] = useState(false)
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null)

  const fetchPageRef = useRef(fetchPage)
  fetchPageRef.current = fetchPage

  const listRef = useRef<HTMLDivElement | null>(null)
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const requestIdRef = useRef(0)
  const loadingMoreRef = useRef(false)

  useEffect(() => {
    if (!searchable) {
      setDebouncedQuery('')
      return
    }
    const timer = window.setTimeout(() => setDebouncedQuery(query.trim()), 250)
    return () => window.clearTimeout(timer)
  }, [query, searchable])

  useEffect(() => {
    setQuery('')
    setDebouncedQuery('')
    setOptions([])
    setPage(0)
    setTotalPages(1)
  }, [resetKey])

  useEffect(() => {
    if (!value) {
      setSelectedLabel(null)
      return
    }
    if (pinnedOption?.id === value) {
      setSelectedLabel(pinnedOption.label)
      return
    }
    const match = options.find((option) => option.id === value)
    if (match) setSelectedLabel(match.label)
  }, [value, pinnedOption, options])

  const loadPage = useCallback(
    async (pageToLoad: number, replace: boolean) => {
      const requestId = ++requestIdRef.current
      if (replace) {
        setInitialLoading(true)
        setLoadError(false)
      } else {
        if (loadingMoreRef.current) return
        loadingMoreRef.current = true
        setLoadingMore(true)
      }

      try {
        const result = await fetchPageRef.current({
          page: pageToLoad,
          limit: pageSize,
          search: searchable && debouncedQuery ? debouncedQuery : undefined,
        })
        if (requestId !== requestIdRef.current) return

        setOptions((prev) => {
          const merged = replace ? result.items : mergeUnique(prev, result.items)
          if (
            pinnedOption?.id &&
            !merged.some((item) => item.id === pinnedOption.id) &&
            (!debouncedQuery ||
              pinnedOption.label.toLowerCase().includes(debouncedQuery.toLowerCase()))
          ) {
            return [pinnedOption, ...merged]
          }
          return merged
        })
        setPage(result.page)
        setTotalPages(Math.max(1, result.totalPages))
        setLoadError(false)
      } catch {
        if (requestId !== requestIdRef.current) return
        if (replace) {
          setOptions([])
          setPage(0)
          setTotalPages(1)
        }
        setLoadError(true)
      } finally {
        if (requestId === requestIdRef.current) {
          setInitialLoading(false)
          setLoadingMore(false)
          loadingMoreRef.current = false
        }
      }
    },
    [debouncedQuery, pageSize, pinnedOption, searchable],
  )

  useEffect(() => {
    if (!open) return
    void loadPage(1, true)
  }, [open, loadPage, resetKey])

  const hasMore = page > 0 && page < totalPages

  useEffect(() => {
    if (!open || disabled) return
    const node = sentinelRef.current
    const root = listRef.current
    if (!node || !root) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry?.isIntersecting) return
        if (initialLoading || loadingMoreRef.current || !hasMore) return
        void loadPage(page + 1, false)
      },
      { root, rootMargin: '48px', threshold: 0 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [disabled, hasMore, initialLoading, loadPage, open, page, options.length])

  const showEmpty = !initialLoading && options.length === 0 && !allowNone
  const radioValue = value || (allowNone ? noneValue : '')

  const triggerLabel =
    !value
      ? allowNone
        ? noneLabel
        : placeholder
      : selectedLabel ||
        (pinnedOption?.id === value ? pinnedOption.label : null) ||
        placeholder

  const handleSelect = (next: string) => {
    if (disabled) return
    const id = next === noneValue ? '' : next
    if (id) {
      const match = options.find((option) => option.id === id)
      if (match) setSelectedLabel(match.label)
      else if (pinnedOption?.id === id) setSelectedLabel(pinnedOption.label)
    } else {
      setSelectedLabel(null)
    }
    onChange(id)
    setOpen(false)
  }

  return (
    <div className={cn('w-full', className)}>
      <Popover
        open={open}
        onOpenChange={(next) => {
          if (disabled) return
          setOpen(next)
          if (!next) {
            setQuery('')
            setDebouncedQuery('')
          }
        }}
      >
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={listboxId}
            className={cn(
              'flex h-11 w-full cursor-pointer items-center justify-between rounded-sm border border-line-strong bg-surface-raised px-4 text-left text-[0.9375rem] outline-none hover:bg-paper/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-danger',
              !value && !allowNone && 'text-ink-muted',
            )}
          >
            <span className="line-clamp-1 min-w-0 flex-1">{triggerLabel}</span>
            <ChevronDown size={16} className="shrink-0 text-ink-muted" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-[var(--radix-popover-trigger-width)] space-y-2 p-2"
          onOpenAutoFocus={(event) => {
            if (!searchable) event.preventDefault()
          }}
        >
          {searchable ? (
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              disabled={disabled}
              autoFocus
            />
          ) : null}
          <div
            ref={listRef}
            id={listboxId}
            role="listbox"
            className={cn(
              'max-h-56 space-y-1 overflow-y-auto overscroll-contain rounded-md border border-line p-1.5',
              disabled && 'pointer-events-none opacity-60',
              listClassName,
            )}
            aria-busy={initialLoading || loadingMore}
          >
            {initialLoading ? (
              <p className="px-1 py-2 text-[0.8125rem] text-ink-muted">{LABELS.loading}</p>
            ) : showEmpty ? (
              <p className="px-1 py-2 text-[0.8125rem] text-ink-muted">
                {loadError ? LABELS.couldNotLoadOptions : emptyMessage}
              </p>
            ) : (
              <RadioGroup
                value={radioValue}
                onValueChange={handleSelect}
                disabled={disabled}
                className="gap-0"
              >
                {allowNone ? (
                  <label
                    htmlFor={`${idPrefix}-none`}
                    className="flex cursor-pointer items-start gap-2 rounded-sm px-1 py-1.5 hover:bg-surface"
                  >
                    <RadioGroupItem id={`${idPrefix}-none`} value={noneValue} className="mt-0.5" />
                    <span className="text-[0.875rem] leading-snug text-ink">{noneLabel}</span>
                  </label>
                ) : null}
                {options.map((option) => {
                  const inputId = `${idPrefix}-${option.id}`
                  return (
                    <label
                      key={option.id}
                      htmlFor={inputId}
                      className="flex cursor-pointer items-start gap-2 rounded-sm px-1 py-1.5 hover:bg-surface"
                    >
                      <RadioGroupItem id={inputId} value={option.id} className="mt-0.5" />
                      <span className="text-[0.875rem] leading-snug text-ink">{option.label}</span>
                    </label>
                  )
                })}
                {!initialLoading && options.length === 0 && allowNone ? (
                  <p className="px-1 py-2 text-[0.8125rem] text-ink-muted">
                    {loadError ? LABELS.couldNotLoadOptions : emptyMessage}
                  </p>
                ) : null}
                <div ref={sentinelRef} className="h-1 w-full" aria-hidden />
                {loadingMore ? (
                  <p className="px-1 py-1 text-[0.8125rem] text-ink-muted">{LABELS.loadingMore}</p>
                ) : null}
              </RadioGroup>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
