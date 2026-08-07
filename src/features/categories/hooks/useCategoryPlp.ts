'use client'

import { useCallback, useMemo, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { categoriesApi } from '../api/categories.api'
import { useProductList } from '@/features/products/api/products.queries'
import { SORT_OPTIONS } from '@/features/products/hooks/useProductListing'
import { navigate } from '@/shared/utils/navigate'
import { PATHS } from '@/shared/constants/paths'
import { LABELS } from '@/shared/constants/labels'
import type { ProductFilters } from '@/features/products/api/products.api'
import type { ProductListItem } from '@/shared/api/types'

const RESERVED_PARAMS = new Set([
  'page',
  'limit',
  'sort',
  'minPrice',
  'maxPrice',
  'rating',
  'search',
  'categoryId',
  'vendorId',
  'includeDescendants',
])

function parseOptionalNumber(value: string | null): number | undefined {
  if (value === null || value === '') return undefined
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

function parseFacetSelections(params: URLSearchParams): Record<string, string[]> {
  const selected: Record<string, string[]> = {}
  params.forEach((value, key) => {
    if (RESERVED_PARAMS.has(key) || !value) return
    selected[key] = value.split(',').map((part) => part.trim()).filter(Boolean)
  })
  return selected
}

export function useCategoryPlp(slugPath: string[]) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const path = slugPath.join('/')

  const [filterOpen, setFilterOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)
  const [compareMode, setCompareMode] = useState(false)
  const [comparedProducts, setComparedProducts] = useState<ProductListItem[]>([])
  const compareSectionRef = useRef<HTMLElement>(null)

  const categoryQuery = useQuery({
    queryKey: ['categories', 'resolve', path],
    queryFn: () => categoriesApi.resolvePath(path),
    enabled: slugPath.length > 0,
    retry: false,
  })

  const facetSelections = useMemo(() => parseFacetSelections(searchParams), [searchParams])

  const facetsQuery = useQuery({
    queryKey: ['categories', 'facets', categoryQuery.data?.id, facetSelections],
    queryFn: () => categoriesApi.facets(categoryQuery.data!.id, facetSelections),
    enabled: Boolean(categoryQuery.data?.id),
  })

  const filters: ProductFilters = useMemo(
    () => ({
      categoryId: categoryQuery.data?.id,
      includeDescendants: true,
      minPrice: parseOptionalNumber(searchParams.get('minPrice')),
      maxPrice: parseOptionalNumber(searchParams.get('maxPrice')),
      rating: parseOptionalNumber(searchParams.get('rating')),
      sort: searchParams.get('sort') || undefined,
      page: parseOptionalNumber(searchParams.get('page')) || 1,
      limit: 20,
      attrs: facetSelections,
    }),
    [categoryQuery.data?.id, searchParams, facetSelections],
  )

  const productsQuery = useProductList(filters, { enabled: Boolean(categoryQuery.data?.id) })

  const pushParams = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const next = new URLSearchParams(searchParams.toString())
      mutate(next)
      const query = next.toString()
      navigate(router, query ? `${pathname}?${query}` : pathname)
    },
    [pathname, router, searchParams],
  )

  const updateFilter = useCallback(
    (key: string, value: unknown) => {
      pushParams((params) => {
        if (value === '' || value === null || value === undefined) {
          params.delete(key)
        } else if (Array.isArray(value)) {
          if (value.length === 0) params.delete(key)
          else params.set(key, value.join(','))
        } else {
          params.set(key, String(value))
        }
        if (key !== 'page') params.delete('page')
      })
    },
    [pushParams],
  )

  const toggleFacetValue = useCallback(
    (filterKey: string, value: string) => {
      const current = facetSelections[filterKey] ?? []
      const next = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
      updateFilter(filterKey, next)
    },
    [facetSelections, updateFilter],
  )

  const clearFilters = useCallback(() => {
    pushParams((params) => {
      Array.from(params.keys()).forEach((key) => {
        if (key === 'sort') return
        params.delete(key)
      })
    })
  }, [pushParams])

  const hasActiveFacets =
    Object.keys(facetSelections).length > 0 ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    filters.rating !== undefined

  const hasSeoNoindex =
    hasActiveFacets || Boolean(filters.sort && filters.sort !== 'trending')

  const breadcrumbItems = useMemo(() => {
    const trail = categoryQuery.data?.breadcrumb ?? []
    return [
      { label: LABELS.allCategories, href: PATHS.categories },
      ...trail.map((node, index) => {
        const slugs = trail.slice(0, index + 1).map((item) => item.slug)
        return {
          label: node.name,
          href: PATHS.category(...slugs),
        }
      }),
    ]
  }, [categoryQuery.data?.breadcrumb])

  const toggleCompareProduct = (product: ProductListItem) => {
    setComparedProducts((current) => {
      if (current.some((item) => item.id === product.id)) {
        return current.filter((item) => item.id !== product.id)
      }
      if (current.length >= 4) return current
      return [...current, product]
    })
  }

  return {
    slugPath,
    category: categoryQuery.data,
    categoryError: categoryQuery.isError,
    categoryLoading: categoryQuery.isLoading,
    facets: facetsQuery.data?.facets ?? [],
    facetSelections,
    filters,
    data: productsQuery.data,
    isFetching: productsQuery.isFetching,
    filterOpen,
    sortOpen,
    compareMode,
    comparedProducts,
    comparedIds: comparedProducts.map((item) => item.id),
    compareSectionRef,
    breadcrumbItems,
    hasActiveFacets,
    hasSeoNoindex,
    sortOptions: SORT_OPTIONS,
    openFilters: () => setFilterOpen(true),
    closeFilters: () => setFilterOpen(false),
    openSort: () => setSortOpen(true),
    closeSort: () => setSortOpen(false),
    toggleCompareMode: () => setCompareMode((value) => !value),
    toggleCompareProduct,
    clearComparedProducts: () => setComparedProducts([]),
    scrollToCompare: () => {
      compareSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    },
    updateFilter,
    toggleFacetValue,
    clearFilters,
    selectSort: (value: string) => {
      updateFilter('sort', value)
      setSortOpen(false)
    },
  }
}
