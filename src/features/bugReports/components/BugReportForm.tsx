'use client'

import { useId, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FormActions, FormFieldFrame, FormSection, FormStack } from '@/shared/components/forms'
import { FormError } from '@/shared/components/FormError'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Textarea } from '@/shared/components/ui/textarea'
import { LABELS } from '@/shared/constants/labels'
import { getApiErrorMessage } from '@/shared/utils/apiErrorMessage'
import { formatLabel } from '@/shared/utils/formatLabel'
import {
  BugAttachmentUploader,
  type UploadedMediaAttachment,
} from '@/features/supportTickets/components/TicketAttachmentUploader'
import {
  BUG_DESCRIPTION_MAX,
  BUG_STEPS_MAX,
  BUG_TITLE_MAX,
} from '@/features/supportTickets/constants/fieldLimits'
import { useCreateBugReport } from '../api/bugReports.queries'

type Props = {
  successHref: (id: string) => string
}

export function BugReportForm({ successHref }: Props) {
  const router = useRouter()
  const draftId = useMemo(() => crypto.randomUUID(), [])
  const capturedPageUrl = useRef(
    typeof document !== 'undefined' ? document.referrer || window.location.href : null,
  )
  const create = useCreateBugReport()

  const titleId = useId()
  const descId = useId()
  const stepsId = useId()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [steps, setSteps] = useState('')
  const [attachments, setAttachments] = useState<UploadedMediaAttachment[]>([])
  const [formError, setFormError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    const trimmedTitle = title.trim()
    const trimmedDescription = description.trim()
    const trimmedSteps = steps.trim()
    if (!trimmedTitle) {
      setFormError(LABELS.bugTitleRequired)
      return
    }
    if (trimmedTitle.length > BUG_TITLE_MAX) {
      setFormError(formatLabel(LABELS.bugTitleTooLong, { max: String(BUG_TITLE_MAX) }))
      return
    }
    if (!trimmedDescription) {
      setFormError(LABELS.bugDescriptionRequired)
      return
    }
    if (trimmedDescription.length > BUG_DESCRIPTION_MAX) {
      setFormError(
        formatLabel(LABELS.bugDescriptionTooLong, { max: String(BUG_DESCRIPTION_MAX) }),
      )
      return
    }
    if (trimmedSteps.length > BUG_STEPS_MAX) {
      setFormError(formatLabel(LABELS.bugStepsTooLong, { max: String(BUG_STEPS_MAX) }))
      return
    }
    try {
      const bug = await create.mutateAsync({
        body: {
          title: trimmedTitle.slice(0, BUG_TITLE_MAX),
          description: trimmedDescription.slice(0, BUG_DESCRIPTION_MAX),
          stepsToReproduce: trimmedSteps.slice(0, BUG_STEPS_MAX) || null,
          attachmentUrls: attachments.map((a) => ({
            url: a.url,
            type: a.bugType!,
            durationSeconds: a.durationSeconds,
          })),
        },
        pageUrl: capturedPageUrl.current,
      })
      router.push(successHref(bug.id))
    } catch (err) {
      setFormError(getApiErrorMessage(err, LABELS.bugCouldNotCreate))
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full min-w-0">
      <FormStack className="space-y-8">
        <div className="flex flex-col gap-4 border-b border-line/70 pb-6 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <div className="min-w-0 space-y-1.5">
            <h1 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
              {LABELS.newBugReport}
            </h1>
            <p className="max-w-3xl text-[0.9375rem] leading-relaxed text-ink-muted">
              {LABELS.newBugReportDescription}
            </p>
          </div>
          <Button type="submit" className="hidden shrink-0 sm:inline-flex" loading={create.isPending}>
            {LABELS.bugSubmit}
          </Button>
        </div>

        <FormSection title={LABELS.bugBasicsSection} hint={LABELS.bugBasicsSectionHint} columns={1}>
          <FormFieldFrame label={LABELS.bugTitle} htmlFor={titleId} required>
            <Input
              id={titleId}
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, BUG_TITLE_MAX))}
              placeholder={LABELS.bugTitlePlaceholder}
              maxLength={BUG_TITLE_MAX}
            />
            <p className="mt-1 text-[0.75rem] tabular-nums text-ink-muted">
              {formatLabel(LABELS.ticketCharCounter, {
                count: title.length,
                max: BUG_TITLE_MAX,
              })}
            </p>
          </FormFieldFrame>
        </FormSection>

        <FormSection
          title={LABELS.bugDescriptionSection}
          hint={LABELS.bugDescriptionSectionHint}
          columns={1}
        >
          <FormFieldFrame label={LABELS.bugDescription} htmlFor={descId} required>
            <Textarea
              id={descId}
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, BUG_DESCRIPTION_MAX))}
              placeholder={LABELS.bugDescriptionPlaceholder}
              rows={6}
              maxLength={BUG_DESCRIPTION_MAX}
            />
            <p className="mt-1 text-[0.75rem] tabular-nums text-ink-muted">
              {formatLabel(LABELS.ticketCharCounter, {
                count: description.length,
                max: BUG_DESCRIPTION_MAX,
              })}
            </p>
          </FormFieldFrame>
          <FormFieldFrame label={LABELS.bugStepsToReproduce} htmlFor={stepsId}>
            <Textarea
              id={stepsId}
              value={steps}
              onChange={(e) => setSteps(e.target.value.slice(0, BUG_STEPS_MAX))}
              placeholder={LABELS.bugStepsPlaceholder}
              rows={5}
              maxLength={BUG_STEPS_MAX}
            />
            <p className="mt-1 text-[0.75rem] tabular-nums text-ink-muted">
              {formatLabel(LABELS.ticketCharCounter, {
                count: steps.length,
                max: BUG_STEPS_MAX,
              })}
            </p>
          </FormFieldFrame>
        </FormSection>

        <FormSection
          title={LABELS.bugAttachmentsSection}
          hint={LABELS.bugAttachmentsSectionHint}
          columns={1}
        >
          <BugAttachmentUploader
            entityId={draftId}
            value={attachments}
            onChange={setAttachments}
            disabled={create.isPending}
          />
        </FormSection>

        <FormError
          error={formError ? new Error(formError) : (create.error as Error | null)}
          fallback={LABELS.bugCouldNotCreate}
        />
        <FormActions>
          <Button type="submit" loading={create.isPending}>
            {LABELS.bugSubmit}
          </Button>
        </FormActions>
      </FormStack>
    </form>
  )
}
