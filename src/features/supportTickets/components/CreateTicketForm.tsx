'use client'

import { useCallback, useEffect, useId, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FormActions, FormFieldFrame, FormSection, FormStack } from '@/shared/components/forms'
import { FormError } from '@/shared/components/FormError'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Textarea } from '@/shared/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import {
  InfiniteSingleSelect,
  type InfiniteSingleSelectPageQuery,
  type InfiniteSingleSelectPageResult,
} from '@/shared/components/InfiniteSingleSelect'
import { LABELS } from '@/shared/constants/labels'
import { DEFAULT_PAGE_LIMIT } from '@/shared/constants/pagination'
import {
  SUPPORT_TICKET_CATEGORY,
  SUPPORT_TICKET_CATEGORY_VALUES,
  type SupportTicketCategory,
} from '@/shared/constants/statuses'
import { getApiErrorMessage } from '@/shared/utils/apiErrorMessage'
import { formatLabel } from '@/shared/utils/formatLabel'
import { formatInr, formatOrderDate, shortOrderId } from '@/features/orders/utils/format'
import { STEP_LABELS } from '@/features/orders/utils/timeline'
import { ordersApi } from '@/features/orders/api/orders.api'
import { vendorsApi } from '@/features/vendors/api/vendors.api'
import { useCreateSupportTicket } from '../api/supportTickets.queries'
import {
  TICKET_DESCRIPTION_MAX,
  TICKET_SUBJECT_MAX,
} from '../constants/fieldLimits'
import { TicketAttachmentUploader, type UploadedMediaAttachment } from './TicketAttachmentUploader'
import { TICKET_CATEGORY_LABEL } from '../utils/labels'

type Props = {
  successHref: (id: string) => string
}

type OrderVendorOption = {
  id: string
  businessName: string
}

function formatOrderOption(order: {
  id: string
  createdAt: string
  status: string
  totalAmount: string | number
}): string {
  const statusLabel =
    STEP_LABELS[order.status as keyof typeof STEP_LABELS] ?? order.status
  return `#${shortOrderId(order.id)} · ${formatOrderDate(order.createdAt)} · ${statusLabel} · ${formatInr(Number(order.totalAmount))}`
}

function collectOrderVendors(
  subOrders: Array<{ vendorId?: string; vendor?: { id?: string; businessName?: string } | null }>,
): OrderVendorOption[] {
  const byId = new Map<string, OrderVendorOption>()
  for (const sub of subOrders) {
    const id = sub.vendor?.id || sub.vendorId
    const businessName = sub.vendor?.businessName
    if (!id || !businessName) continue
    if (!byId.has(id)) byId.set(id, { id, businessName })
  }
  return Array.from(byId.values())
}

export function CreateTicketForm({ successHref }: Props) {
  const router = useRouter()
  const draftId = useMemo(() => crypto.randomUUID(), [])
  const create = useCreateSupportTicket()

  const subjectId = useId()
  const descId = useId()

  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<SupportTicketCategory>(SUPPORT_TICKET_CATEGORY.OTHER)
  const [relatedOrderId, setRelatedOrderId] = useState('')
  const [relatedVendorId, setRelatedVendorId] = useState('')
  const [orderVendors, setOrderVendors] = useState<OrderVendorOption[]>([])
  const [attachments, setAttachments] = useState<UploadedMediaAttachment[]>([])
  const [formError, setFormError] = useState<string | null>(null)

  const hasOrder = Boolean(relatedOrderId.trim())
  const showDirectoryVendorPicker =
    !hasOrder && category === SUPPORT_TICKET_CATEGORY.VENDOR
  const showOrderVendorPicker = hasOrder && orderVendors.length > 1
  const showVendorSection = showDirectoryVendorPicker || showOrderVendorPicker || (hasOrder && orderVendors.length === 1)

  useEffect(() => {
    let cancelled = false

    if (!relatedOrderId.trim()) {
      setOrderVendors([])
      return
    }

    void (async () => {
      try {
        const order = await ordersApi.detail(relatedOrderId.trim())
        if (cancelled) return
        const vendors = collectOrderVendors(order.subOrders ?? [])
        setOrderVendors(vendors)
        if (vendors.length === 0) {
          setRelatedVendorId('')
        } else if (vendors.length === 1) {
          setRelatedVendorId(vendors[0]!.id)
        } else {
          setRelatedVendorId((prev) =>
            vendors.some((vendor) => vendor.id === prev) ? prev : '',
          )
        }
      } catch {
        if (cancelled) return
        setOrderVendors([])
        setRelatedVendorId('')
      }
    })()

    return () => {
      cancelled = true
    }
  }, [relatedOrderId])

  useEffect(() => {
    if (!hasOrder && category !== SUPPORT_TICKET_CATEGORY.VENDOR) {
      setRelatedVendorId('')
    }
  }, [category, hasOrder])

  const fetchOrdersPage = useCallback(
    async (query: InfiniteSingleSelectPageQuery): Promise<InfiniteSingleSelectPageResult> => {
      const result = await ordersApi.myOrders(query.page, query.limit)
      return {
        items: result.items.map((order) => ({
          id: order.id,
          label: formatOrderOption(order),
        })),
        page: result.page,
        totalPages: result.totalPages,
        total: result.total,
      }
    },
    [],
  )

  const fetchVendorsPage = useCallback(
    async (query: InfiniteSingleSelectPageQuery): Promise<InfiniteSingleSelectPageResult> => {
      const result = await vendorsApi.directory({
        page: query.page,
        limit: query.limit,
        search: query.search,
      })
      return {
        items: result.items.map((vendor) => ({
          id: vendor.id,
          label: vendor.businessName,
        })),
        page: result.page,
        totalPages: result.totalPages,
        total: result.total,
      }
    },
    [],
  )

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    const trimmedSubject = subject.trim()
    const trimmedDescription = description.trim()
    if (!trimmedSubject) {
      setFormError(LABELS.ticketSubjectRequired)
      return
    }
    if (trimmedSubject.length > TICKET_SUBJECT_MAX) {
      setFormError(
        formatLabel(LABELS.ticketSubjectTooLong, { max: String(TICKET_SUBJECT_MAX) }),
      )
      return
    }
    if (!trimmedDescription) {
      setFormError(LABELS.ticketDescriptionRequired)
      return
    }
    if (trimmedDescription.length > TICKET_DESCRIPTION_MAX) {
      setFormError(
        formatLabel(LABELS.ticketDescriptionTooLong, {
          max: String(TICKET_DESCRIPTION_MAX),
        }),
      )
      return
    }
    const vendorRequired =
      category === SUPPORT_TICKET_CATEGORY.VENDOR || orderVendors.length > 1
    if (vendorRequired && !relatedVendorId.trim()) {
      setFormError(LABELS.ticketVendorRequired)
      return
    }
    try {
      const ticket = await create.mutateAsync({
        subject: trimmedSubject.slice(0, TICKET_SUBJECT_MAX),
        description: trimmedDescription.slice(0, TICKET_DESCRIPTION_MAX),
        category,
        relatedOrderId: relatedOrderId.trim() || null,
        relatedVendorId: relatedVendorId.trim() || null,
        attachmentUrls: attachments.map(({ url, type, durationSeconds }) => ({
          url,
          type,
          durationSeconds,
        })),
      })
      router.push(successHref(ticket.id))
    } catch (err) {
      setFormError(getApiErrorMessage(err, LABELS.ticketCouldNotCreate))
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full min-w-0">
      <FormStack className="space-y-8">
        <div className="flex flex-col gap-4 border-b border-line/70 pb-6 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <div className="min-w-0 space-y-1.5">
            <h1 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
              {LABELS.newSupportTicket}
            </h1>
            <p className="max-w-3xl text-[0.9375rem] leading-relaxed text-ink-muted">
              {LABELS.newSupportTicketDescription}
            </p>
          </div>
          <Button type="submit" className="hidden shrink-0 sm:inline-flex" loading={create.isPending}>
            {LABELS.ticketSubmit}
          </Button>
        </div>

        <FormSection
          title={LABELS.ticketBasicsSection}
          hint={LABELS.ticketBasicsSectionHint}
          columns={1}
        >
          <FormFieldFrame label={LABELS.ticketSubject} htmlFor={subjectId} required>
            <Input
              id={subjectId}
              value={subject}
              onChange={(e) => setSubject(e.target.value.slice(0, TICKET_SUBJECT_MAX))}
              placeholder={LABELS.ticketSubjectPlaceholder}
              maxLength={TICKET_SUBJECT_MAX}
            />
            <p className="mt-1 text-[0.75rem] tabular-nums text-ink-muted">
              {formatLabel(LABELS.ticketCharCounter, {
                count: subject.length,
                max: TICKET_SUBJECT_MAX,
              })}
            </p>
          </FormFieldFrame>
          <FormFieldFrame label={LABELS.ticketCategory} required>
            <Select
              value={category}
              onValueChange={(v) => setCategory(v as SupportTicketCategory)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SUPPORT_TICKET_CATEGORY_VALUES.map((value) => (
                  <SelectItem key={value} value={value}>
                    {TICKET_CATEGORY_LABEL[value]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormFieldFrame>
        </FormSection>

        <FormSection
          title={LABELS.ticketDescriptionSection}
          hint={LABELS.ticketDescriptionSectionHint}
          columns={1}
        >
          <FormFieldFrame label={LABELS.ticketDescription} htmlFor={descId} required>
            <Textarea
              id={descId}
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, TICKET_DESCRIPTION_MAX))}
              placeholder={LABELS.ticketDescriptionPlaceholder}
              rows={8}
              maxLength={TICKET_DESCRIPTION_MAX}
            />
            <p className="mt-1 text-[0.75rem] tabular-nums text-ink-muted">
              {formatLabel(LABELS.ticketCharCounter, {
                count: description.length,
                max: TICKET_DESCRIPTION_MAX,
              })}
            </p>
          </FormFieldFrame>
        </FormSection>

        <FormSection
          title={LABELS.ticketOrderSection}
          hint={LABELS.ticketOrderSectionHint}
          columns={1}
        >
          <FormFieldFrame label={LABELS.ticketSelectOrder}>
            <InfiniteSingleSelect
              value={relatedOrderId}
              onChange={setRelatedOrderId}
              fetchPage={fetchOrdersPage}
              allowNone
              noneLabel={LABELS.ticketNoOrder}
              placeholder={LABELS.ticketSelectOrder}
              searchable={false}
              emptyMessage={LABELS.ticketNoOrdersYet}
              pageSize={DEFAULT_PAGE_LIMIT}
            />
          </FormFieldFrame>
        </FormSection>

        {showVendorSection ? (
          <FormSection
            title={LABELS.ticketRelatedVendor}
            hint={LABELS.ticketRelatedVendorHint}
            columns={1}
          >
            {showOrderVendorPicker ? (
              <FormFieldFrame label={LABELS.ticketSelectVendor} required>
                <Select value={relatedVendorId} onValueChange={setRelatedVendorId}>
                  <SelectTrigger>
                    <SelectValue placeholder={LABELS.ticketSelectVendor} />
                  </SelectTrigger>
                  <SelectContent>
                    {orderVendors.map((vendor) => (
                      <SelectItem key={vendor.id} value={vendor.id}>
                        {vendor.businessName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormFieldFrame>
            ) : null}

            {hasOrder && orderVendors.length === 1 ? (
              <FormFieldFrame label={LABELS.ticketRelatedVendor}>
                <Input value={orderVendors[0]!.businessName} disabled readOnly />
              </FormFieldFrame>
            ) : null}

            {showDirectoryVendorPicker ? (
              <FormFieldFrame label={LABELS.ticketSelectVendor} required>
                <InfiniteSingleSelect
                  value={relatedVendorId}
                  onChange={setRelatedVendorId}
                  fetchPage={fetchVendorsPage}
                  placeholder={LABELS.ticketSelectVendor}
                  searchPlaceholder={LABELS.ticketSearchVendors}
                  emptyMessage={LABELS.noVendorsFound}
                  pageSize={DEFAULT_PAGE_LIMIT}
                />
              </FormFieldFrame>
            ) : null}
          </FormSection>
        ) : null}

        <FormSection
          title={LABELS.ticketAttachmentsSection}
          hint={LABELS.ticketAttachmentsSectionHint}
          columns={1}
        >
          <TicketAttachmentUploader
            entityId={draftId}
            value={attachments}
            onChange={setAttachments}
            disabled={create.isPending}
          />
        </FormSection>

        <FormError
          error={formError ? new Error(formError) : (create.error as Error | null)}
          fallback={LABELS.ticketCouldNotCreate}
        />
        <FormActions>
          <Button type="submit" loading={create.isPending} className="sm:hidden">
            {LABELS.ticketSubmit}
          </Button>
        </FormActions>
      </FormStack>
    </form>
  )
}
