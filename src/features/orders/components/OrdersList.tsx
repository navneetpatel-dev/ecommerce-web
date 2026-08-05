'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { Order } from '@/shared/api/types'
import { StatusBadge } from '@/shared/components/StatusBadge'
import { Pagination } from '@/shared/components/Pagination'
import { useState } from 'react'

interface OrdersListProps {
  orders: Order[]
  pagination?: {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
  }
}

export function OrdersList({ orders, pagination }: OrdersListProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-[1.75rem] font-semibold text-ink mb-6">Your Orders</h1>
      <div className="space-y-3">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/orders/${order.id}`}
            className="flex items-center gap-4 p-4 rounded-md border border-line bg-surface hover:shadow-elevation-1 transition-shadow"
          >
            <div className="font-mono text-[0.8125rem] text-ink-muted shrink-0 w-24">
              #{order.id.slice(0, 8)}
            </div>
            <div className="font-sans text-[0.8125rem] text-ink-muted shrink-0 w-24">
              {new Date(order.createdAt).toLocaleDateString('en-IN')}
            </div>
            <div className="flex-1 flex items-center gap-2 min-w-0">
              {order.subOrders?.flatMap((so: any) => so.items || []).slice(0, 3).map((item: any) => (
                item.product?.imageUrl && (
                  <Image
                    key={item.id}
                    src={item.product.imageUrl}
                    alt={item.productName || item.product?.name || ''}
                    width={40}
                    height={40}
                    className="rounded-sm object-cover border border-line shrink-0"
                  />
                )
              ))}
              {(order.subOrders?.flatMap((so: any) => so.items || []).length || 0) > 3 && (
                <span className="text-[0.8125rem] text-ink-muted shrink-0">
                  +{(order.subOrders?.flatMap((so: any) => so.items || []).length || 0) - 3}
                </span>
              )}
            </div>
            <div className="font-sans text-[0.9375rem] font-semibold text-brand shrink-0">
              ₹{order.totalAmount.toLocaleString('en-IN')}
            </div>
            <div className="shrink-0">
              <StatusBadge status={order.status} />
            </div>
          </Link>
        ))}
      </div>
      {pagination && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={pagination.onPageChange}
        />
      )}
    </div>
  )
}
