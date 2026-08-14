'use client'

import { useId, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FormActions, FormFieldFrame, FormSection, FormStack } from '@/shared/components/forms'
import { FormError } from '@/shared/components/FormError'
import { DisabledActionHint } from '@/shared/components/DisabledActionHint'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Textarea } from '@/shared/components/ui/textarea'
import { LABELS } from '@/shared/constants/labels'
import { useManualFormFieldErrors } from '@/shared/hooks/useManualFormFieldErrors'
import { getApiErrorMessage } from '@/shared/utils/apiErrorMessage'
import { formatLabel } from '@/shared/utils/formatLabel'
import {
  allRequiredFieldsMet,
  firstMissingRequiredHint,
} from '@/shared/utils/firstMissingRequiredHint'
import { readLastBrowseUrl } from '@/shared/utils/lastBrowseUrl'
import {
  BugAttachmentUploader,
  type UploadedMediaAttachment,
} from '@/features/supportTickets/components/TicketAttachmentUploader'
import {
  BUG_DESCRIPTION_MAX,
  BUG_STEPS_MAX,
  BUG_TITLE_MAX,
} from '../constants/fieldLimits'
import { useCreateBugReport } from '../api/bugReports.queries'

type BugReportField = 'title' | 'description' | 'steps' | 'attachments'

type Props = {
  successHref: (id: string) => string
  /** When true, omit the page H1 (parent already renders one). */
  hideTitle?: boolean
}

export function BugReportForm({ successHref, hideTitle = false }: Props) {
  const router = useRouter()
  const draftId = useMemo(() => crypto.randomUUID(), [])
  const capturedPageUrl = useRef(readLastBrowseUrl())
  const create = useCreateBugReport()

  const titleId = useId()
  const descId = useId()
  const stepsId = useId()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [steps, setSteps] = useState('')
  const [attachments, setAttachments] = useState<UploadedMediaAttachment[]>([])
  const [apiError, setApiError] = useState<string | null>(null)
  const { clearAll, clearField, setErrors, getError, hasError } =
    useManualFormFieldErrors<BugReportField>()

  const requiredChecks = useMemo(
    () => [
      { ok: Boolean(title.trim()), message: LABELS.enterBugTitle },
      { ok: Boolean(description.trim()), message: LABELS.enterBugDescription },
    ],
    [title, description],
  )
  const canSubmit = allRequiredFieldsMet(requiredChecks)
  const disableHint = firstMissingRequiredHint(requiredChecks) ?? ''

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError(null)
    clearAll()

    const trimmedTitle = title.trim()
    const trimmedDescription = description.trim()
    const trimmedSteps = steps.trim()
    const nextErrors: Partial<Record<BugReportField, string>> = {}

    if (!trimmedTitle) {
      nextErrors.title = LABELS.bugTitleRequired
    } else if (trimmedTitle.length > BUG_TITLE_MAX) {
      nextErrors.title = formatLabel(LABELS.bugTitleTooLong, { max: String(BUG_TITLE_MAX) })
    }

    if (!trimmedDescription) {
      nextErrors.description = LABELS.bugDescriptionRequired
    } else if (trimmedDescription.length > BUG_DESCRIPTION_MAX) {
      nextErrors.description = formatLabel(LABELS.bugDescriptionTooLong, {
        max: String(BUG_DESCRIPTION_MAX),
      })
    }

    if (trimmedSteps.length > BUG_STEPS_MAX) {
      nextErrors.steps = formatLabel(LABELS.bugStepsTooLong, { max: String(BUG_STEPS_MAX) })
    }

    if (attachments.some((a) => !a.bugType)) {
      nextErrors.attachments = LABELS.bugAttachmentTypeMissing
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
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
      setApiError(getApiErrorMessage(err, LABELS.bugCouldNotCreate))
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full min-w-0">
      <FormStack className="space-y-8">
        {hideTitle ? null : (
          <div className="flex flex-col gap-4 border-b border-line/70 pb-6 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
            <div className="min-w-0 space-y-1.5">
              <h1 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
                {LABELS.newBugReport}
              </h1>
              <p className="max-w-3xl text-[0.9375rem] leading-relaxed text-ink-muted">
                {LABELS.newBugReportDescription}
              </p>
            </div>
            <DisabledActionHint disabled={!canSubmit} message={disableHint}>
              <Button
                type="submit"
                className="hidden shrink-0 sm:inline-flex"
                loading={create.isPending}
                disabled={!canSubmit || create.isPending}
              >
                {LABELS.bugSubmit}
              </Button>
            </DisabledActionHint>
          </div>
        )}

        <FormSection title={LABELS.bugBasicsSection} hint={LABELS.bugBasicsSectionHint} columns={1}>
          <FormFieldFrame
            label={LABELS.bugTitle}
            htmlFor={titleId}
            required
            error={getError('title')}
          >
            <Input
              id={titleId}
              value={title}
              onChange={(e) => {
                clearField('title')
                setTitle(e.target.value.slice(0, BUG_TITLE_MAX))
              }}
              placeholder={LABELS.bugTitlePlaceholder}
              maxLength={BUG_TITLE_MAX}
              error={hasError('title')}
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
          columns={2}
        >
          <FormFieldFrame
            label={LABELS.bugDescription}
            htmlFor={descId}
            required
            error={getError('description')}
          >
            <Textarea
              id={descId}
              value={description}
              onChange={(e) => {
                clearField('description')
                setDescription(e.target.value.slice(0, BUG_DESCRIPTION_MAX))
              }}
              placeholder={LABELS.bugDescriptionPlaceholder}
              rows={6}
              maxLength={BUG_DESCRIPTION_MAX}
              error={hasError('description')}
            />
            <p className="mt-1 text-[0.75rem] tabular-nums text-ink-muted">
              {formatLabel(LABELS.ticketCharCounter, {
                count: description.length,
                max: BUG_DESCRIPTION_MAX,
              })}
            </p>
          </FormFieldFrame>
          <FormFieldFrame
            label={LABELS.bugStepsToReproduce}
            htmlFor={stepsId}
            error={getError('steps')}
          >
            <Textarea
              id={stepsId}
              value={steps}
              onChange={(e) => {
                clearField('steps')
                setSteps(e.target.value.slice(0, BUG_STEPS_MAX))
              }}
              placeholder={LABELS.bugStepsPlaceholder}
              rows={5}
              maxLength={BUG_STEPS_MAX}
              error={hasError('steps')}
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
            onChange={(next) => {
              clearField('attachments')
              setAttachments(next)
            }}
            disabled={create.isPending}
          />
          {getError('attachments') ? (
            <p role="alert" className="text-[0.8125rem] text-danger">
              {getError('attachments')}
            </p>
          ) : null}
        </FormSection>

        <FormError
          error={apiError ? new Error(apiError) : (create.error as Error | null)}
          fallback={LABELS.bugCouldNotCreate}
        />
        <FormActions>
          <DisabledActionHint disabled={!canSubmit} message={disableHint}>
            <Button
              type="submit"
              fullWidth="mobile"
              loading={create.isPending}
              disabled={!canSubmit || create.isPending}
            >
              {LABELS.bugSubmit}
            </Button>
          </DisabledActionHint>
        </FormActions>
      </FormStack>
    </form>
  )
}
