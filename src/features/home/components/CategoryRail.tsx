import Link from 'next/link'
import type { Category } from '@/shared/api/types'

interface CategoryRailProps {
  categories: Category[]
}

export function CategoryRail({ categories }: CategoryRailProps) {
  if (!categories.length) return null

  return (
    <section>
      <h2 className="font-display text-2xl font-semibold mb-6">Shop by Category</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?category=${cat.slug}`}
            className="shrink-0 snap-start w-36 text-center group"
          >
            <div className="h-24 w-24 mx-auto rounded-full bg-brand-light flex items-center justify-center group-hover:bg-brand transition-colors">
              <span className="text-sm font-medium text-brand group-hover:text-white">
                {cat.name.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <p className="mt-2 text-sm font-medium">{cat.name}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
