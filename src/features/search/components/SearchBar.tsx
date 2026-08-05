'use client'

import Image from 'next/image'
import { Search } from 'lucide-react'
import { useSearchNavigation } from '../hooks/useSearchNavigation'
import { cn } from '@/shared/utils/cn'

interface SearchBarProps {
  size?: 'lg' | 'sm'
  className?: string
}

export function SearchBar({ size = 'lg', className }: SearchBarProps) {
  const { term, open, suggestions, updateTerm, handleSelect, handleSubmit, openDropdown, closeDropdown } = useSearchNavigation()

  return (
    <div className={cn('relative w-full', className)}>
      <form onSubmit={handleSubmit} className="relative">
        <Search size={size === 'sm' ? 16 : 20} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none" />
        <input
          type="text"
          value={term}
          onChange={(e) => updateTerm(e.target.value)}
          onFocus={openDropdown}
          onBlur={closeDropdown}
          placeholder="Search products, vendors..."
          className={cn(
            'w-full rounded-full border border-line bg-paper px-4 placeholder:text-ink-faint focus-visible:outline-hidden focus-visible:border-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
            size === 'sm' ? 'h-11 text-[0.8125rem] pl-9' : 'h-11 text-[0.9375rem] pl-11'
          )}
        />
      </form>
      {open && suggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 border border-line bg-surface-raised rounded-md shadow-elevation-2 max-h-80 overflow-auto z-50">
          {suggestions.map((s) => (
            <button
              key={s.id}
              className="flex items-center gap-3 w-full px-4 h-12 text-left hover:bg-brand-subtle transition-colors"
              onMouseDown={() => handleSelect(s.slug)}
            >
              <Image src={s.imageUrl} alt={s.name} width={32} height={32} className="rounded object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[0.9375rem] font-medium truncate">{s.name}</p>
                <p className="text-[0.8125rem] text-ink-muted">₹{s.basePrice}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
