'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Input } from '@/shared/components/ui/input'
import { LABELS } from '@/shared/constants/labels'
import { DEFAULT_PAGE_LIMIT } from '@/shared/constants/pagination'
import { cn } from '@/shared/utils/cn'
import { formatLabel } from '@/shared/utils/formatLabel'

export type InfiniteMultiSelectOption = {
  id: string
  label: string
}

export type InfiniteMultiSelectPageQuery = {
  page: number
  limit: number
  search?: string
}

export type InfiniteMultiSelectPageResult = {
  items: InfiniteMultiSelectOption[]
  page: number
  totalPages: number
  total: number
}

export interface InfiniteMultiSelectProps {
  value: string[]
  onChange: (ids: string[]) => void
  /** Fetch one page. Must return server pagination meta so infinite scroll can continue. */
  fetchPage: (query: InfiniteMultiSelectPageQuery) => Promise<InfiniteMultiSelectPageResult>
  /**
   * When this changes, the list resets and reloads from page 1
   * (e.g. scope type, vendor filter).
   */
  resetKey?: string | number | null
  searchPlaceholder?: string
  emptyMessage?: string
  noneSelectedLabel?: string
  selectedCountLabel?: string
  error?: boolean
  disabled?: boolean
  pageSize?: number
  className?: string
  listClassName?: string
  /** Prefix for option checkbox ids (avoid collisions when multiple pickers mount). */
  idPrefix?: string
}

function mergeUnique(
  existing: InfiniteMultiSelectOption[],
  incoming: InfiniteMultiSelectOption[],
): InfiniteMultiSelectOption[] {
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

export function InfiniteMultiSelect({
  value,
  onChange,
  fetchPage,
  resetKey = null,
  searchPlaceholder = LABELS.search,
  emptyMessage = LABELS.noResults,
  noneSelectedLabel = LABELS.noneSelected,
  selectedCountLabel = LABELS.selectedCount,
  error = false,
  disabled = false,
  pageSize = DEFAULT_PAGE_LIMIT,
  className,
  listClassName,
  idPrefix = 'infinite-multi-select',
}: InfiniteMultiSelectProps) {
  const [options, setOptions] = useState<InfiniteMultiSelectOption[]>([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [initialLoading, setInitialLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [loadError, setLoadError] = useState(false)

  const fetchPageRef = useRef(fetchPage)
  fetchPageRef.current = fetchPage

  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const requestIdRef = useRef(0)
  const loadingMoreRef = useRef(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query.trim()), 250)
    return () => window.clearTimeout(timer)
  }, [query])

  useEffect(() => {
    setQuery('')
    setDebouncedQuery('')
  }, [resetKey])

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
          search: debouncedQuery || undefined,
        })
        if (requestId !== requestIdRef.current) return

        setOptions((prev) => (replace ? result.items : mergeUnique(prev, result.items)))
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
    [debouncedQuery, pageSize],
  )

  useEffect(() => {
    void loadPage(1, true)
  }, [loadPage, resetKey])

  const hasMore = page > 0 && page < totalPages

  useEffect(() => {
    const node = sentinelRef.current
    if (!node || disabled) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry?.isIntersecting) return
        if (initialLoading || loadingMoreRef.current || !hasMore) return
        void loadPage(page + 1, false)
      },
      { root: node.parentElement, rootMargin: '48px', threshold: 0 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [disabled, hasMore, initialLoading, loadPage, page, options.length])

  const selectedSet = useMemo(() => new Set(value), [value])

  const toggle = (id: string) => {
    if (disabled) return
    if (selectedSet.has(id)) {
      onChange(value.filter((item) => item !== id))
      return
    }
    onChange([...value, id])
  }

  const showEmpty = !initialLoading && options.length === 0

  return (
    <div className={cn('space-y-2', className)}>
      <Input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={searchPlaceholder}
        aria-label={searchPlaceholder}
        disabled={disabled}
      />
      <div
        className={cn(
          'max-h-48 space-y-1 overflow-y-auto overscroll-contain rounded-md border border-line p-2',
          error && 'border-danger',
          disabled && 'pointer-events-none opacity-60',
          listClassName,
        )}
        role="group"
        aria-busy={initialLoading || loadingMore}
      >
        {initialLoading ? (
          <p className="px-1 py-2 text-[0.8125rem] text-ink-muted">{LABELS.loading}</p>
        ) : showEmpty ? (
          <p className="px-1 py-2 text-[0.8125rem] text-ink-muted">
            {loadError ? LABELS.couldNotLoadOptions : emptyMessage}
          </p>
        ) : (
          <>
            {options.map((option) => {
              const checked = selectedSet.has(option.id)
              const inputId = `${idPrefix}-${option.id}`
              return (
                <label
                  key={option.id}
                  htmlFor={inputId}
                  className="flex cursor-pointer items-start gap-2 rounded-sm px-1 py-1.5 hover:bg-surface"
                >
                  <Checkbox
                    id={inputId}
                    checked={checked}
                    disabled={disabled}
                    onCheckedChange={() => toggle(option.id)}
                    className="mt-0.5"
                  />
                  <span className="text-[0.875rem] leading-snug text-ink">{option.label}</span>
                </label>
              )
            })}
            <div ref={sentinelRef} className="h-1 w-full" aria-hidden />
            {loadingMore ? (
              <p className="px-1 py-1 text-[0.8125rem] text-ink-muted">{LABELS.loadingMore}</p>
            ) : null}
          </>
        )}
      </div>
      <p className="text-[0.8125rem] text-ink-muted">
        {value.length === 0
          ? noneSelectedLabel
          : formatLabel(selectedCountLabel, { count: String(value.length) })}
      </p>
    </div>
  )
}
