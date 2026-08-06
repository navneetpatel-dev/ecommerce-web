import { useQuery } from '@tanstack/react-query'
import { vendorsApi } from './vendors.api'

export const vendorKeys = {
  all: ['vendors'] as const,
  bySlug: (slug: string) => [...vendorKeys.all, 'slug', slug] as const,
}

export function useVendorBySlug(slug: string) {
  return useQuery({
    queryKey: vendorKeys.bySlug(slug),
    queryFn: () => vendorsApi.getBySlug(slug),
    enabled: !!slug,
    retry: false,
  })
}
