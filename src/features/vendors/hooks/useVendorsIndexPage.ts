'use client'

import { useStorefrontVendors } from '../api/vendors.queries'

export function useVendorsIndexPage() {
  const query = useStorefrontVendors({ page: 1, limit: 48 })

  return {
    vendors: query.data?.items ?? [],
    isLoading: query.isLoading,
    isEmpty: !query.isLoading && (query.data?.items.length ?? 0) === 0,
  }
}
