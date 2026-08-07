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
import { PATHS } from '@/shared/constants/paths'

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

/** Flatten a category tree into a stable list (depth-first). */
export function flattenCategories(categories: Category[]): Category[] {
  const out: Category[] = []
  const walk = (nodes: Category[]) => {
    for (const node of nodes) {
      out.push(node)
      if (node.children?.length) walk(node.children)
    }
  }
  walk(categories)
  return out
}

/** Flatten with depth for indented pickers (Department / Category / Subcategory). */
export function flattenCategoriesWithDepth(
  categories: Category[],
  depth = 0,
): Array<Category & { depth: number }> {
  const out: Array<Category & { depth: number }> = []
  for (const node of categories) {
    out.push({ ...node, depth })
    if (node.children?.length) {
      out.push(...flattenCategoriesWithDepth(node.children, depth + 1))
    }
  }
  return out
}

/** Build slug path from root → leaf using a flat or nested tree. */
export function buildCategorySlugPath(
  categoryId: string,
  categories: Category[],
): string[] {
  const byId = new Map<string, Category>()
  const index = (nodes: Category[]) => {
    for (const node of nodes) {
      byId.set(node.id, node)
      if (node.children?.length) index(node.children)
    }
  }
  index(categories)

  const path: string[] = []
  let cursor = byId.get(categoryId)
  while (cursor) {
    path.unshift(cursor.slug)
    cursor = cursor.parentId ? byId.get(cursor.parentId) : undefined
  }
  return path
}

export function categoryHref(category: Category, tree: Category[]): string {
  if (category.path) return PATHS.category(...category.path.split('/').filter(Boolean))
  const slugs = buildCategorySlugPath(category.id, tree)
  return slugs.length ? PATHS.category(...slugs) : PATHS.categories
}

/** Top-level categories (no parent), stable displayOrder then name. */
export function getRootCategories(categories: Category[]): Category[] {
  return categories
    .filter((category) => !category.parentId)
    .slice()
    .sort(
      (a, b) =>
        (a.displayOrder ?? 0) - (b.displayOrder ?? 0) || a.name.localeCompare(b.name),
    )
}

export function getChildCategories(categories: Category[], parentId: string): Category[] {
  return categories
    .filter((category) => category.parentId === parentId)
    .slice()
    .sort(
      (a, b) =>
        (a.displayOrder ?? 0) - (b.displayOrder ?? 0) || a.name.localeCompare(b.name),
    )
}
