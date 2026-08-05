import Image from 'next/image'
import { Search } from 'lucide-react'
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
            'absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none',
            onDark ? 'text-paper/70' : 'text-ink-muted'
          )}
        />
        <input
          type="text"
          value={term}
          onChange={(e) => onTermChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder="Search products, vendors..."
          className={cn(
            'w-full rounded-full border px-4 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
            size === 'sm' ? 'h-11 text-[0.8125rem] pl-9' : 'h-11 text-[0.9375rem] pl-11',
            onDark
              ? 'border-paper/25 bg-paper/10 text-paper placeholder:text-paper/55 focus-visible:border-paper/50'
              : 'border-line bg-paper placeholder:text-ink-faint focus-visible:border-brand'
          )}
        />
      </form>
      {showPanel ? (
        <div className="absolute top-full left-0 right-0 mt-1 border border-line bg-surface-raised rounded-md shadow-elevation-2 max-h-80 overflow-auto z-50">
          {isFetching && !suggestions?.length ? (
            <div className="space-y-2 p-3">
              <div className="h-10 animate-pulse rounded-md bg-line/60" />
              <div className="h-10 animate-pulse rounded-md bg-line/60" />
              <div className="h-10 animate-pulse rounded-md bg-line/60" />
            </div>
          ) : (
            suggestions?.map((s) => (
              <button
                key={s.id}
                className="flex items-center gap-3 w-full px-4 h-12 text-left hover:bg-brand-subtle transition-colors"
                onMouseDown={() => onSelect(s.slug)}
              >
                <Image src={s.imageUrl} alt={s.name} width={32} height={32} className="rounded object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[0.9375rem] font-medium truncate">{s.name}</p>
                  <p className="text-[0.8125rem] text-ink-muted">₹{s.basePrice}</p>
                </div>
              </button>
            ))
          )}
        </div>
      ) : null}
    </div>
  )
}
