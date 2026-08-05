'use client'

import { useVendorCommissions, useVendorPayouts } from '../api/vendor.queries'

export function usePayoutsPage() {
  const { data: commissions, isLoading: loadingComm } = useVendorCommissions()
  const { data: payouts, isLoading: loadingPay } = useVendorPayouts()

  return {
    commissions,
    payouts,
    loadingComm,
    loadingPay,
  }
}
