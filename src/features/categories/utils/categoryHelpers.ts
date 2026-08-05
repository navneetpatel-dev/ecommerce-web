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

/** Temporary preview images — remove once categories ship real `imageUrl` from the API. */
const DEMO_CATEGORY_IMAGES: Record<string, string> = {
  fashion:
    'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80',
  food:
    'https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&w=1200&q=80',
  home:
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
  electronics:
    'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1200&q=80',
  beauty:
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80',
  sports:
    'https://images.unsplash.com/photo-1517649763962-0c623066027b?auto=format&fit=crop&w=1200&q=80',
}

export function resolveCategoryIcon(category: Category): LucideIcon {
  const key = (category.slug || category.name || '').toLowerCase()
  const match = Object.entries(CATEGORY_ICONS).find(([token]) => key.includes(token))
  return match?.[1] ?? Sparkles
}

/** Prefer API image; fall back to demo preview images for a subset of slugs. */
export function resolveCategoryImageUrl(category: Category): string | undefined {
  if (category.imageUrl) return category.imageUrl
  const key = (category.slug || '').toLowerCase()
  return DEMO_CATEGORY_IMAGES[key]
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
