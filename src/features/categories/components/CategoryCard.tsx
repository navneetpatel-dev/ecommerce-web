'use client'

import { useCallback, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { MediaImage } from '@/shared/components/MediaImage'
import { PATHS } from '@/shared/constants/paths'
import { resolveCategoryImageUrl } from '../utils/categoryHelpers'
import type { Category } from '@/shared/api/types'

interface CategoryCardProps {
  category: Category
  className?: string
}

export function CategoryCard({ category, className }: CategoryCardProps) {
  const imageUrl = resolveCategoryImageUrl(category)
  const [unavailable, setUnavailable] = useState(!imageUrl)
  const hasImage = !unavailable

  const handleUnavailableChange = useCallback((next: boolean) => {
    setUnavailable(next)
  }, [])

  return (
    <Link
      href={`${PATHS.products}?categoryId=${category.id}`}
      className={cn(
        'group relative block aspect-[4/3] overflow-hidden rounded-md border border-line bg-paper',
        'transition-colors duration-200',
        !hasImage && 'hover:border-brand',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
        'outline-none',
        className
      )}
    >
      <MediaImage
        src={imageUrl}
        alt=""
        unavailableLabel={`${category.name} image not available`}
        sizes="(max-width: 640px) 50vw, (max-width: 1280px) 25vw, 20vw"
        imageClassName="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        onUnavailableChange={handleUnavailableChange}
      />

      {hasImage ? (
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
          aria-hidden
        />
      ) : (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-paper/90 to-transparent"
          aria-hidden
        />
      )}

      <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between gap-2 p-3 md:p-3.5">
        <h3
          className={cn(
            'text-[0.9375rem] font-medium leading-snug',
            hasImage ? 'text-white' : 'text-ink group-hover:text-brand'
          )}
        >
          {category.name}
        </h3>
        <ArrowUpRight
          className={cn(
            'h-3.5 w-3.5 shrink-0 transition-all duration-200',
            'group-hover:translate-x-0.5 group-hover:-translate-y-0.5',
            hasImage
              ? 'text-white/80 group-hover:text-white'
              : 'text-ink-muted group-hover:text-brand'
          )}
          strokeWidth={1.5}
          aria-hidden
        />
      </div>
    </Link>
  )
}
