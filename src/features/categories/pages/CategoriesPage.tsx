'use client'

import { useCategoriesPage } from '../hooks/useCategoriesPage'
import { CategoriesView } from '../components/CategoriesView'

export function CategoriesPage() {
  const page = useCategoriesPage()

  return (
    <CategoriesView
      roots={page.roots}
      rootsWithChildren={page.rootsWithChildren}
      isLoading={page.isLoading}
      isEmpty={page.isEmpty}
    />
  )
}
