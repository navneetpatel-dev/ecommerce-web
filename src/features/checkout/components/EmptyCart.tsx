'use client'
import { EmptyState } from '@/shared/components/EmptyState'
import { useRouter } from 'next/navigation'

export function EmptyCart() {
  const router = useRouter()

  return (
    <EmptyState
      message="Your cart is empty"
      actionLabel="Continue shopping"
      onAction={() => router.push('/')}
      maxWidth="max-w-2xl"
    />
  )
}
