'use client'

import { useCallback, useEffect, useId, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FormActions, FormFieldFrame, FormSection, FormStack } from '@/shared/components/forms'
import { FormError } from '@/shared/components/FormError'
import { DisabledActionHint } from '@/shared/components/DisabledActionHint'
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
import { useManualFormFieldErrors } from '@/shared/hooks/useManualFormFieldErrors'
import { getApiErrorMessage } from '@/shared/utils/apiErrorMessage'
import { cn } from '@/shared/utils/cn'
import { formatLabel } from '@/shared/utils/formatLabel'
import {
  allRequiredFieldsMet,
  firstMissingRequiredHint,
} from '@/shared/utils/firstMissingRequiredHint'
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

type TicketField = 'subject' | 'description' | 'relatedVendorId'

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
  const [apiError, setApiError] = useState<string | null>(null)
  const { clearAll, clearField, setErrors, getError, hasError } =
    useManualFormFieldErrors<TicketField>()

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

  const vendorRequired =
    category === SUPPORT_TICKET_CATEGORY.VENDOR || orderVendors.length > 1

  const requiredChecks = useMemo(
    () => [
      { ok: Boolean(subject.trim()), message: LABELS.enterTicketSubject },
      { ok: Boolean(description.trim()), message: LABELS.enterTicketDescription },
      {
        ok: !vendorRequired || Boolean(relatedVendorId.trim()),
        message: LABELS.selectTicketVendor,
      },
    ],
    [subject, description, vendorRequired, relatedVendorId],
  )
  const canSubmit = allRequiredFieldsMet(requiredChecks)
  const disableHint = firstMissingRequiredHint(requiredChecks) ?? ''

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError(null)
    clearAll()

    const trimmedSubject = subject.trim()
    const trimmedDescription = description.trim()
    const nextErrors: Partial<Record<TicketField, string>> = {}

    if (!trimmedSubject) {
      nextErrors.subject = LABELS.ticketSubjectRequired
    } else if (trimmedSubject.length > TICKET_SUBJECT_MAX) {
      nextErrors.subject = formatLabel(LABELS.ticketSubjectTooLong, {
        max: String(TICKET_SUBJECT_MAX),
      })
    }

    if (!trimmedDescription) {
      nextErrors.description = LABELS.ticketDescriptionRequired
    } else if (trimmedDescription.length > TICKET_DESCRIPTION_MAX) {
      nextErrors.description = formatLabel(LABELS.ticketDescriptionTooLong, {
        max: String(TICKET_DESCRIPTION_MAX),
      })
    }

    if (vendorRequired && !relatedVendorId.trim()) {
      nextErrors.relatedVendorId = LABELS.ticketVendorRequired
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
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
      setApiError(getApiErrorMessage(err, LABELS.ticketCouldNotCreate))
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full min-w-0">
      <FormStack className="space-y-8">
        <div className="space-y-1.5 border-b border-line/70 pb-6">
          <h1 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
            {LABELS.newSupportTicket}
          </h1>
          <p className="max-w-3xl text-[0.9375rem] leading-relaxed text-ink-muted">
            {LABELS.newSupportTicketDescription}
          </p>
        </div>

        <FormSection
          title={LABELS.ticketBasicsSection}
          hint={LABELS.ticketBasicsSectionHint}
          columns={1}
        >
          <FormFieldFrame
            label={LABELS.ticketSubject}
            htmlFor={subjectId}
            required
            error={getError('subject')}
          >
            <Input
              id={subjectId}
              value={subject}
              onChange={(e) => {
                clearField('subject')
                setSubject(e.target.value.slice(0, TICKET_SUBJECT_MAX))
              }}
              placeholder={LABELS.ticketSubjectPlaceholder}
              maxLength={TICKET_SUBJECT_MAX}
              error={hasError('subject')}
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
          <FormFieldFrame
            label={LABELS.ticketDescription}
            htmlFor={descId}
            required
            error={getError('description')}
          >
            <Textarea
              id={descId}
              value={description}
              onChange={(e) => {
                clearField('description')
                setDescription(e.target.value.slice(0, TICKET_DESCRIPTION_MAX))
              }}
              placeholder={LABELS.ticketDescriptionPlaceholder}
              rows={8}
              maxLength={TICKET_DESCRIPTION_MAX}
              error={hasError('description')}
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
              <FormFieldFrame
                label={LABELS.ticketSelectVendor}
                required
                error={getError('relatedVendorId')}
              >
                <Select
                  value={relatedVendorId}
                  onValueChange={(value) => {
                    clearField('relatedVendorId')
                    setRelatedVendorId(value)
                  }}
                >
                  <SelectTrigger
                    className={cn(hasError('relatedVendorId') && 'border-danger')}
                  >
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
              <FormFieldFrame
                label={LABELS.ticketSelectVendor}
                required
                error={getError('relatedVendorId')}
              >
                <InfiniteSingleSelect
                  value={relatedVendorId}
                  onChange={(value) => {
                    clearField('relatedVendorId')
                    setRelatedVendorId(value)
                  }}
                  fetchPage={fetchVendorsPage}
                  placeholder={LABELS.ticketSelectVendor}
                  searchPlaceholder={LABELS.ticketSearchVendors}
                  emptyMessage={LABELS.noVendorsFound}
                  pageSize={DEFAULT_PAGE_LIMIT}
                  error={hasError('relatedVendorId')}
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
          error={apiError ? new Error(apiError) : (create.error as Error | null)}
          fallback={LABELS.ticketCouldNotCreate}
        />
        <FormActions>
          <DisabledActionHint disabled={!canSubmit} message={disableHint}>
            <Button
              type="submit"
              loading={create.isPending}
              disabled={!canSubmit || create.isPending}
            >
              {LABELS.ticketSubmit}
            </Button>
          </DisabledActionHint>
        </FormActions>
      </FormStack>
    </form>
  )
}
