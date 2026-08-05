import Link from 'next/link'
import Image from 'next/image'
import type { Category } from '@/shared/api/types'

interface CategoryRailProps {
  categories: Category[]
}

export function CategoryRail({ categories }: CategoryRailProps) {
  if (!categories.length) return null

  return (
    <section>
      <h2 className="text-[1.375rem] font-semibold text-ink mb-6">Shop by Category</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x lg:overflow-visible lg:flex-wrap lg:gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?categoryId=${cat.id}`}
            className="shrink-0 snap-start w-40 lg:w-48 group relative rounded-md overflow-hidden"
            style={{ aspectRatio: '4/3' }}
          >
            {cat.imageUrl ? (
              <Image
                src={cat.imageUrl}
                alt={cat.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 160px, 192px"
              />
            ) : (
              <div className="absolute inset-0 bg-brand-subtle" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <h3 className="text-[1.125rem] font-semibold text-white">{cat.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
