'use client'

import { useMemo } from 'react'
import { useCategories } from '../api/categories.queries'
import { getChildCategories, getRootCategories } from '../utils/categoryHelpers'
import type { Category } from '@/shared/api/types'

export function useCategoriesPage() {
  const { data: categories = [], isLoading } = useCategories()

  const roots = useMemo(() => getRootCategories(categories), [categories])

  const rootsWithChildren = useMemo(
    () =>
      roots
        .map((root) => ({
          root,
          children: root.children?.length
            ? [...root.children].sort(
                (a, b) =>
                  (a.displayOrder ?? 0) - (b.displayOrder ?? 0) || a.name.localeCompare(b.name),
              )
            : getChildCategories(categories, root.id),
        }))
        .filter((entry) => entry.children.length > 0),
    [categories, roots],
  )

  return {
    isLoading,
    categories,
    roots,
    rootsWithChildren,
    isEmpty: !isLoading && roots.length === 0,
  }
}

export type CategoryRootWithChildren = {
  root: Category
  children: Category[]
}
