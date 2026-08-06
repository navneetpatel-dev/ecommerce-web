import {
  Baby,
  BookOpen,
  Car,
  Cpu,
  Gem,
  Home,
  Shirt,
  Sparkles,
  Trophy,
  UtensilsCrossed,
  type LucideIcon,
} from 'lucide-react'
import type { Category } from '@/shared/api/types'

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

export function resolveCategoryIcon(category: Category): LucideIcon {
  const key = (category.slug || category.name || '').toLowerCase()
  const match = Object.entries(CATEGORY_ICONS).find(([token]) => key.includes(token))
  return match?.[1] ?? Sparkles
}

/** Prefer API image only — no demo Unsplash fallbacks. */
export function resolveCategoryImageUrl(category: Category): string | undefined {
  return category.imageUrl || undefined
}

/** Top-level categories (no parent), stable name order. */
export function getRootCategories(categories: Category[]): Category[] {
  return categories
    .filter((category) => !category.parentId)
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
}

export function getChildCategories(categories: Category[], parentId: string): Category[] {
  return categories
    .filter((category) => category.parentId === parentId)
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
}
