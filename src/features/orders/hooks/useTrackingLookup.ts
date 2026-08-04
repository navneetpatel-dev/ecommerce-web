import { useState } from 'react'
import { shippingApi } from '../api/shipping.api'

export function useTrackingLookup() {
  const [trackingNumber, setTrackingNumber] = useState('')
  const [result, setResult] = useState<any>(null)

  const lookup = async () => {
    const data = await shippingApi.tracking(trackingNumber)
    setResult(data)
  }

  return { trackingNumber, setTrackingNumber, result, lookup }
}
