'use client'

import { useShippingRates } from '../api/checkout.queries'
import type { ShippingRate } from '@/shared/api/types'

export function useShippingCard(pincode: string, weightGrams: number) {
  const { data: rates = [], isLoading, isError } = useShippingRates(pincode, weightGrams)

  const options = (rates as ShippingRate[]).filter(
    (rate) => rate.method === 'STANDARD' || rate.method === 'EXPRESS',
  )

  return { options, isLoading, isError }
}
