'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { Button } from '@/shared/components/ui/button'

interface OrderConfirmationProps {
  orderId: string | undefined
}

function AnimatedCheckmark() {
  const circleRef = useRef<SVGCircleElement>(null)
  const checkRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      circleRef.current?.classList.add('animate-checkmark-circle')
      checkRef.current?.classList.add('animate-checkmark-check')
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="h-16 w-16 mx-auto mb-6">
      <svg viewBox="0 0 52 52" className="w-full h-full">
        <circle
          ref={circleRef}
          cx="26" cy="26" r="24"
          fill="none"
          stroke="var(--success)"
          strokeWidth="2.5"
          strokeDasharray="157"
          strokeDashoffset="157"
          style={{ animationDuration: '0.5s', animationFillMode: 'forwards', animationTimingFunction: 'ease-out' }}
        />
        <path
          ref={checkRef}
          d="M14 27l7 7 16-16"
          fill="none"
          stroke="var(--success)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="48"
          strokeDashoffset="48"
          style={{ animationDuration: '0.3s', animationDelay: '0.25s', animationFillMode: 'forwards', animationTimingFunction: 'ease-out' }}
        />
      </svg>
    </div>
  )
}

export function OrderConfirmation({ orderId }: OrderConfirmationProps) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <AnimatedCheckmark />
      <h1 className="text-[1.75rem] font-semibold text-ink mb-2 font-display">Order confirmed!</h1>
      <p className="font-mono text-[0.8125rem] text-ink-muted mb-4">Order #{orderId?.slice(0, 8)}</p>
      <p className="text-[0.9375rem] text-ink-muted mb-2 max-w-md mx-auto">
        You&apos;ll get a shipping update by email for each seller&apos;s package separately.
      </p>
      <p className="text-[0.8125rem] text-ink-faint mb-8 max-w-md mx-auto">
        Your order may arrive in multiple shipments from different vendors. Each vendor handles their own shipping.
      </p>
      <div className="flex gap-3 justify-center">
        <Button variant="outline" asChild>
          <Link href={orderId ? `/orders/${orderId}` : '/orders'}>View order</Link>
        </Button>
        <Button asChild>
          <Link href="/">Continue shopping</Link>
        </Button>
      </div>
    </div>
  )
}
