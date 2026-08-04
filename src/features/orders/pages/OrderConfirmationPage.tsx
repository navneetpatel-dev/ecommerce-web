'use client'
import { useParams } from 'next/navigation'
import { OrderConfirmation } from '../components/OrderConfirmation'

export function OrderConfirmationPage() {
  const params = useParams<{ orderId: string }>()
  return <OrderConfirmation orderId={params?.orderId} />
}
