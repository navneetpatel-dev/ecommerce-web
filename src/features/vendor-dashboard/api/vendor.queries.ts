import { useQuery } from '@tanstack/react-query'
import { vendorApi } from './vendor.api'

export function useVendorSummary() {
  return useQuery({ queryKey: ['vendor', 'summary'], queryFn: () => vendorApi.summary() })
}

export function useVendorProducts(page = 1, filters?: { status?: string; search?: string }) {
  return useQuery({
    queryKey: ['vendor', 'products', page, filters],
    queryFn: () => vendorApi.products(page, filters),
  })
}

export function useVendorCommissions(page = 1) {
  return useQuery({
    queryKey: ['vendor', 'commissions', page],
    queryFn: () => vendorApi.commissions(page),
  })
}

export function useVendorPayouts(page = 1) {
  return useQuery({
    queryKey: ['vendor', 'payouts', page],
    queryFn: () => vendorApi.payouts(page),
  })
}
