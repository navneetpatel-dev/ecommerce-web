'use client'

import Image from 'next/image'
import { useSearchNavigation } from '../hooks/useSearchNavigation'

export function SearchBar() {
  const { term, open, suggestions, updateTerm, handleSelect, handleSubmit, openDropdown, closeDropdown } = useSearchNavigation()

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={term}
          onChange={(e) => updateTerm(e.target.value)}
          onFocus={openDropdown}
          onBlur={closeDropdown}
          placeholder="Search products, vendors..."
          className="w-full h-9 rounded-md border border-line bg-paper px-3 py-1 text-sm placeholder:text-ink/50 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-brand"
        />
      </form>
      {open && suggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 border border-line bg-surface rounded-md shadow-lg max-h-80 overflow-auto z-50">
          {suggestions.map((s) => (
            <button
              key={s.id}
              className="flex items-center gap-3 w-full px-3 py-2 text-left hover:bg-paper transition-colors"
              onMouseDown={() => handleSelect(s.slug)}
            >
              <Image src={s.imageUrl} alt={s.name} width={40} height={40} className="rounded object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{s.name}</p>
                <p className="text-xs text-ink/50">₹{s.basePrice}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
