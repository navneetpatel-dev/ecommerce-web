'use client'

import { useId, useMemo, useState } from 'react'
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
import { LABELS } from '@/shared/constants/labels'
import { MAX_PAGE_LIMIT } from '@/shared/constants/pagination'
import {
  SUPPORT_TICKET_CATEGORY,
  SUPPORT_TICKET_CATEGORY_VALUES,
  type SupportTicketCategory,
} from '@/shared/constants/statuses'
import { getApiErrorMessage } from '@/shared/utils/apiErrorMessage'
import { formatLabel } from '@/shared/utils/formatLabel'
import { formatInr, formatOrderDate, shortOrderId } from '@/features/orders/utils/format'
import { ordersApi } from '@/features/orders/api/orders.api'
import { useQuery } from '@tanstack/react-query'
import { useCreateSupportTicket } from '../api/supportTickets.queries'
import {
  TICKET_DESCRIPTION_MAX,
  TICKET_SUBJECT_MAX,
} from '../constants/fieldLimits'
import { TicketAttachmentUploader, type UploadedMediaAttachment } from './TicketAttachmentUploader'
import { TICKET_CATEGORY_LABEL } from '../utils/labels'

const NO_ORDER = '__none__'

type Props = {
  successHref: (id: string) => string
}

export function CreateTicketForm({ successHref }: Props) {
  const router = useRouter()
  const draftId = useMemo(() => crypto.randomUUID(), [])
  const create = useCreateSupportTicket()
  const ordersQuery = useQuery({
    queryKey: ['orders', 'mine', 'ticket-picker', MAX_PAGE_LIMIT],
    queryFn: () => ordersApi.myOrders(1, MAX_PAGE_LIMIT),
  })

  const subjectId = useId()
  const descId = useId()

  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<SupportTicketCategory>(SUPPORT_TICKET_CATEGORY.OTHER)
  const [relatedOrderId, setRelatedOrderId] = useState(NO_ORDER)
  const [attachments, setAttachments] = useState<UploadedMediaAttachment[]>([])
  const [formError, setFormError] = useState<string | null>(null)

  const orders = ordersQuery.data?.items ?? []

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
    try {
      const ticket = await create.mutateAsync({
        subject: trimmedSubject.slice(0, TICKET_SUBJECT_MAX),
        description: trimmedDescription.slice(0, TICKET_DESCRIPTION_MAX),
        category,
        relatedOrderId: relatedOrderId === NO_ORDER ? null : relatedOrderId,
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
            <Select value={relatedOrderId} onValueChange={setRelatedOrderId}>
              <SelectTrigger>
                <SelectValue placeholder={LABELS.ticketSelectOrder} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_ORDER}>{LABELS.ticketNoOrder}</SelectItem>
                {orders.map((order) => (
                  <SelectItem key={order.id} value={order.id}>
                    #{shortOrderId(order.id)} · {formatOrderDate(order.createdAt)} ·{' '}
                    {order.status.replaceAll('_', ' ')} · {formatInr(order.totalAmount)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!ordersQuery.isLoading && orders.length === 0 ? (
              <p className="mt-1 text-[0.75rem] text-ink-muted">{LABELS.ticketNoOrdersYet}</p>
            ) : null}
          </FormFieldFrame>
        </FormSection>

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
          <Button type="submit" loading={create.isPending} className="hidden sm:inline-flex">
            {LABELS.ticketSubmit}
          </Button>
        </FormActions>
      </FormStack>
    </form>
  )
}
