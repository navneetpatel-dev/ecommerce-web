'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import type { Category } from '@/shared/api/types'
import { resolveCategoryIcon } from '../utils/categoryHelpers'

interface CategoryCardProps {
  category: Category
  className?: string
}

export function CategoryCard({ category, className }: CategoryCardProps) {
  const Icon = resolveCategoryIcon(category)
  const hasImage = Boolean(category.imageUrl)

  return (
    <Link
      href={`/products?categoryId=${category.id}`}
      className={cn(
        'group relative block aspect-[4/3] overflow-hidden rounded-md border border-line',
        'transition-colors duration-200',
        hasImage ? 'bg-ink' : 'bg-paper',
        'hover:border-ink/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
        className
      )}
    >
      {hasImage ? (
        <Image
          src={category.imageUrl!}
          alt=""
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 50vw, (max-width: 1280px) 25vw, 20vw"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center pb-6">
          <Icon
            className="h-8 w-8 text-ink-faint transition-colors duration-200 group-hover:text-brand md:h-9 md:w-9"
            strokeWidth={1.25}
            aria-hidden
          />
        </div>
      )}

      {hasImage && (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      )}

      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 p-3 md:p-3.5">
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
              : 'text-ink-faint group-hover:text-brand'
          )}
          strokeWidth={1.5}
          aria-hidden
        />
      </div>
    </Link>
  )
}
