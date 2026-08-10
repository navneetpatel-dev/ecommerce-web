import Image from 'next/image'
import { Search } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { LABELS } from '@/shared/constants/labels'
import { cn } from '@/shared/utils/cn'

interface SearchSuggestion {
  id: string
  slug: string
  name: string
  imageUrl: string
  basePrice: number
}

interface SearchBarProps {
  size?: 'lg' | 'sm'
  className?: string
  /** High-contrast treatment when the header sits over a dark surface. */
  onDark?: boolean
  term: string
  open: boolean
  suggestions?: SearchSuggestion[]
  isFetching?: boolean
  onTermChange: (value: string) => void
  onFocus: () => void
  onBlur: () => void
  onSubmit: (event: React.FormEvent) => void
  onSelect: (slug: string) => void
}

export function SearchBar({
  size = 'lg',
  className,
  onDark = false,
  term,
  open,
  suggestions,
  isFetching = false,
  onTermChange,
  onFocus,
  onBlur,
  onSubmit,
  onSelect,
}: SearchBarProps) {
  const showPanel = open && (isFetching || (suggestions && suggestions.length > 0))

  return (
    <div className={cn('relative w-full', className)}>
      <form onSubmit={onSubmit} className="relative">
        <Search
          size={size === 'sm' ? 16 : 20}
          className={cn(
            'pointer-events-none absolute left-4 top-1/2 z-[1] -translate-y-1/2',
            onDark ? 'text-paper/70' : 'text-ink-muted',
          )}
          aria-hidden
        />
        <Input
          type="search"
          value={term}
          onChange={(e) => onTermChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={LABELS.searchProductsVendors}
          className={cn(
            'rounded-full',
            size === 'sm' ? 'pl-9 text-[0.8125rem]' : 'pl-11',
            onDark &&
              'border-paper/25 bg-paper/10 text-paper placeholder:text-paper/55 focus-visible:border-paper/50',
          )}
        />
      </form>
      {showPanel ? (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-80 overflow-auto rounded-md border border-line bg-surface-raised shadow-elevation-2">
          {isFetching && !suggestions?.length ? (
            <div className="space-y-2 p-3">
              <div className="h-10 animate-pulse rounded-md bg-line/60" />
              <div className="h-10 animate-pulse rounded-md bg-line/60" />
              <div className="h-10 animate-pulse rounded-md bg-line/60" />
            </div>
          ) : (
            suggestions?.map((s) => (
              <Button
                key={s.id}
                type="button"
                variant="ghost"
                className="h-12 w-full justify-start gap-3 rounded-none px-4"
                onMouseDown={() => onSelect(s.slug)}
              >
                <Image
                  src={s.imageUrl}
                  alt={s.name}
                  width={32}
                  height={32}
                  className="shrink-0 rounded object-cover"
                />
                <span className="min-w-0 flex-1 text-left">
                  <span className="block truncate text-[0.9375rem] font-medium text-ink">{s.name}</span>
                  <span className="block text-[0.8125rem] text-ink-muted">₹{s.basePrice}</span>
                </span>
              </Button>
            ))
          )}
        </div>
      ) : null}
    </div>
  )
}
