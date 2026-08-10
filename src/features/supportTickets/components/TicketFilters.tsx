'use client'

import { useMemo } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { FormFieldFrame } from '@/shared/components/forms'
import { Input } from '@/shared/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { LABELS } from '@/shared/constants/labels'
import {
  SUPPORT_TICKET_CATEGORY_VALUES,
  SUPPORT_TICKET_PRIORITY_VALUES,
  SUPPORT_TICKET_STATUS_VALUES,
  type SupportTicketCategory,
  type SupportTicketPriority,
  type SupportTicketStatus,
} from '@/shared/constants/statuses'
import type { TicketListParams } from '../api/supportTickets.api'
import { TICKET_CATEGORY_LABEL, TICKET_PRIORITY_LABEL, TICKET_STATUS_LABEL } from '../utils/labels'

const ALL = 'ALL'

export function useTicketFiltersFromUrl(): TicketListParams {
  const searchParams = useSearchParams()
  return useMemo(() => {
    const status = searchParams.get('status') as SupportTicketStatus | null
    const priority = searchParams.get('priority') as SupportTicketPriority | null
    const category = searchParams.get('category') as SupportTicketCategory | null
    const vendorId = searchParams.get('vendorId')
    return {
      status: status && SUPPORT_TICKET_STATUS_VALUES.includes(status) ? status : undefined,
      priority:
        priority && SUPPORT_TICKET_PRIORITY_VALUES.includes(priority) ? priority : undefined,
      category:
        category && SUPPORT_TICKET_CATEGORY_VALUES.includes(category) ? category : undefined,
      vendorId: vendorId || undefined,
    }
  }, [searchParams])
}

export function TicketFilters({ showVendorId = true }: { showVendorId?: boolean }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(searchParams.toString())
    if (!value || value === ALL) next.delete(key)
    else next.set(key, value)
    const qs = next.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname)
  }

  return (
    <div
      className={`grid gap-3 border border-line bg-surface-raised p-4 sm:grid-cols-2 ${
        showVendorId ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
      }`}
    >
      <FormFieldFrame label={LABELS.status}>
        <Select
          value={searchParams.get('status') ?? ALL}
          onValueChange={(v) => setParam('status', v)}
        >
          <SelectTrigger>
            <SelectValue placeholder={LABELS.ticketFilterAllStatuses} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>{LABELS.ticketFilterAllStatuses}</SelectItem>
            {SUPPORT_TICKET_STATUS_VALUES.map((status) => (
              <SelectItem key={status} value={status}>
                {TICKET_STATUS_LABEL[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormFieldFrame>
      <FormFieldFrame label={LABELS.priority}>
        <Select
          value={searchParams.get('priority') ?? ALL}
          onValueChange={(v) => setParam('priority', v)}
        >
          <SelectTrigger>
            <SelectValue placeholder={LABELS.ticketFilterAllPriorities} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>{LABELS.ticketFilterAllPriorities}</SelectItem>
            {SUPPORT_TICKET_PRIORITY_VALUES.map((priority) => (
              <SelectItem key={priority} value={priority}>
                {TICKET_PRIORITY_LABEL[priority]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormFieldFrame>
      <FormFieldFrame label={LABELS.category}>
        <Select
          value={searchParams.get('category') ?? ALL}
          onValueChange={(v) => setParam('category', v)}
        >
          <SelectTrigger>
            <SelectValue placeholder={LABELS.ticketFilterAllCategories} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>{LABELS.ticketFilterAllCategories}</SelectItem>
            {SUPPORT_TICKET_CATEGORY_VALUES.map((category) => (
              <SelectItem key={category} value={category}>
                {TICKET_CATEGORY_LABEL[category]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormFieldFrame>
      {showVendorId ? (
        <FormFieldFrame label={LABELS.ticketFilterVendorId}>
          <Input
            defaultValue={searchParams.get('vendorId') ?? ''}
            placeholder={LABELS.ticketFilterVendorId}
            onBlur={(e) => setParam('vendorId', e.target.value.trim() || null)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setParam('vendorId', (e.target as HTMLInputElement).value.trim() || null)
              }
            }}
          />
        </FormFieldFrame>
      ) : null}
    </div>
  )
}
