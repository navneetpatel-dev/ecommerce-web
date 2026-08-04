import { X } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'

interface FilterSidebarProps {
  minPrice: string | number | undefined
  maxPrice: string | number | undefined
  onUpdateFilter: (key: string, value: unknown) => void
  onClear: () => void
}

export function FilterSidebar({ minPrice, maxPrice, onUpdateFilter, onClear }: FilterSidebarProps) {
  return (
    <aside className="w-56 shrink-0 hidden lg:block">
      <div className="space-y-6 sticky top-20">
        <div>
          <h3 className="font-semibold text-sm mb-3">Price Range</h3>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              className="w-full h-8 rounded border border-line bg-surface px-2 text-xs"
              value={minPrice || ''}
              onChange={(e) => onUpdateFilter('minPrice', e.target.value ? Number(e.target.value) : undefined)}
            />
            <input
              type="number"
              placeholder="Max"
              className="w-full h-8 rounded border border-line bg-surface px-2 text-xs"
              value={maxPrice || ''}
              onChange={(e) => onUpdateFilter('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>
        </div>
        <Button variant="ghost" size="sm" className="text-ink/50" onClick={onClear}>
          <X className="h-3 w-3" /> Clear all filters
        </Button>
      </div>
    </aside>
  )
}
