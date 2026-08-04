interface SortBarProps {
  sort: string | undefined
  totalProducts: number | undefined
  isFetching: boolean
  onSortChange: (value: string) => void
}

export function SortBar({ sort, totalProducts, isFetching, onSortChange }: SortBarProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <p className="text-sm text-ink/70">
        {totalProducts !== undefined ? `${totalProducts} products` : isFetching ? 'Loading...' : ''}
      </p>
      <select
        className="h-8 rounded border border-line bg-surface px-2 text-xs"
        value={sort || ''}
        onChange={(e) => onSortChange(e.target.value)}
      >
        <option value="">Sort by</option>
        <option value="trending">Trending</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="newest">Newest</option>
        <option value="rating">Top Rated</option>
      </select>
    </div>
  )
}
