'use client'

import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowUpRight,
  BookOpen,
  Car,
  Cpu,
  Gem,
  Home,
  Shirt,
  Sparkles,
  Trophy,
  UtensilsCrossed,
  Baby,
  type LucideIcon,
} from 'lucide-react'
import { TextEyebrow } from '@/shared/components/TextEyebrow'
import { cn } from '@/shared/utils/cn'
import type { Category } from '@/shared/api/types'

interface CategoryRailProps {
  categories: Category[]
}

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  electronics: Cpu,
  fashion: Shirt,
  home: Home,
  sports: Trophy,
  beauty: Sparkles,
  books: BookOpen,
  toys: Baby,
  food: UtensilsCrossed,
  automotive: Car,
  jewelry: Gem,
}

function resolveIcon(category: Category): LucideIcon {
  const key = (category.slug || category.name || '').toLowerCase()
  const match = Object.entries(CATEGORY_ICONS).find(([token]) => key.includes(token))
  return match?.[1] ?? Sparkles
}

export function CategoryRail({ categories }: CategoryRailProps) {
  if (!categories.length) return null

  return (
    <section>
      <TextEyebrow className="mb-2">Browse</TextEyebrow>
      <h2 className="text-[1.375rem] font-semibold text-ink mb-8">Shop by Category</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
        {categories.map((cat) => {
          const Icon = resolveIcon(cat)
          const hasImage = Boolean(cat.imageUrl)

          return (
            <Link
              key={cat.id}
              href={`/products?categoryId=${cat.id}`}
              className={cn(
                'group relative block aspect-[4/3] overflow-hidden rounded-md border border-line',
                'transition-colors duration-200',
                hasImage ? 'bg-ink' : 'bg-paper',
                'hover:border-ink/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand'
              )}
            >
              {hasImage ? (
                <Image
                  src={cat.imageUrl!}
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
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/65 via-transparent to-transparent" />
              )}

              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 p-3 md:p-3.5">
                <h3
                  className={cn(
                    'text-[0.9375rem] font-medium leading-snug',
                    hasImage ? 'text-paper' : 'text-ink group-hover:text-brand'
                  )}
                >
                  {cat.name}
                </h3>
                <ArrowUpRight
                  className={cn(
                    'h-3.5 w-3.5 shrink-0 transition-all duration-200',
                    'group-hover:translate-x-0.5 group-hover:-translate-y-0.5',
                    hasImage
                      ? 'text-paper/75 group-hover:text-paper'
                      : 'text-ink-faint group-hover:text-brand'
                  )}
                  strokeWidth={1.5}
                  aria-hidden
                />
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
