'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Check } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar'
import { Button } from '@/shared/components/ui/button'
import { FormFieldFrame } from '@/shared/components/forms'
import { FormError } from '@/shared/components/FormError'
import { Input } from '@/shared/components/ui/input'
import { Textarea } from '@/shared/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { StatusBadge } from '@/shared/components/StatusBadge'
import { TextEyebrow } from '@/shared/components/TextEyebrow'
import { LABELS } from '@/shared/constants/labels'
import { PATHS } from '@/shared/constants/paths'
import {
  BUG_AFFECTED_MODULE,
  BUG_AFFECTED_MODULE_VALUES,
  BUG_ATTACHMENT_TYPE,
  BUG_REPORT_SEVERITY,
  BUG_REPORT_SEVERITY_VALUES,
  BUG_REPORT_STATUS,
  type BugAffectedModule,
  type BugReportSeverity,
  type BugReportStatus,
} from '@/shared/constants/statuses'
import { formatOrderDate } from '@/features/orders/utils/format'
import { getApiErrorMessage } from '@/shared/utils/apiErrorMessage'
import { cn } from '@/shared/utils/cn'
import { formatLabel } from '@/shared/utils/formatLabel'
import {
  BUG_MODULE_LABEL,
  BUG_SEVERITY_LABEL,
  BUG_STATUS_LABEL,
} from '@/features/supportTickets/utils/labels'
import {
  BUG_COMMENT_MAX,
  BUG_WONT_FIX_REASON_MAX,
} from '@/features/supportTickets/constants/fieldLimits'
import {
  useAddBugComment,
  useBugCommentsInfinite,
  useMarkBugDuplicate,
  useTriageBugReport,
  useUpdateBugStatus,
  useVerifyBug,
  useWontFixBug,
} from '../api/bugReports.queries'
import type { BugAttachment, BugReport } from '../api/bugReports.api'

type Props = {
  report: BugReport
  mode: 'reporter' | 'admin'
  backHref?: string
}

const ADMIN_STATUS_OPTIONS: BugReportStatus[] = [
  BUG_REPORT_STATUS.IN_PROGRESS,
  BUG_REPORT_STATUS.FIXED,
  BUG_REPORT_STATUS.VERIFIED,
  BUG_REPORT_STATUS.CLOSED,
]

type ProgressStep = {
  label: string
  status: 'completed' | 'current' | 'upcoming'
}

function AttachmentGrid({ attachments }: { attachments?: BugAttachment[] }) {
  if (!attachments?.length) return null
  return (
    <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
      {attachments.map((item) => (
        <li
          key={item.id ?? item.url}
          className="aspect-square overflow-hidden rounded-md border border-line bg-paper"
        >
          {item.type === BUG_ATTACHMENT_TYPE.SCREEN_RECORDING ? (
            <video
              src={item.url}
              className="h-full w-full object-cover"
              muted
              playsInline
              preload="metadata"
              controls
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.url} alt="" loading="lazy" className="h-full w-full object-cover" />
          )}
        </li>
      ))}
    </ul>
  )
}

function statusTimeline(report: BugReport): ProgressStep[] {
  const order: BugReportStatus[] = [
    BUG_REPORT_STATUS.NEW,
    BUG_REPORT_STATUS.TRIAGED,
    BUG_REPORT_STATUS.IN_PROGRESS,
    BUG_REPORT_STATUS.FIXED,
    BUG_REPORT_STATUS.VERIFIED,
  ]
  const labels: Record<string, string> = {
    [BUG_REPORT_STATUS.NEW]: LABELS.bugStatusNew,
    [BUG_REPORT_STATUS.TRIAGED]: LABELS.bugStatusTriaged,
    [BUG_REPORT_STATUS.IN_PROGRESS]: LABELS.bugStatusInProgress,
    [BUG_REPORT_STATUS.FIXED]: LABELS.bugStatusFixed,
    [BUG_REPORT_STATUS.VERIFIED]: LABELS.bugStatusVerified,
  }

  let currentIndex = order.indexOf(report.status)
  if (report.status === BUG_REPORT_STATUS.CLOSED) currentIndex = order.length
  if (
    report.status === BUG_REPORT_STATUS.WONT_FIX ||
    report.status === BUG_REPORT_STATUS.DUPLICATE
  ) {
    currentIndex = Math.max(order.indexOf(BUG_REPORT_STATUS.TRIAGED), 0)
  }
  if (currentIndex < 0) currentIndex = 0

  return order.map((status, index) => ({
    label: labels[status]!,
    status:
      index < currentIndex
        ? ('completed' as const)
        : index === currentIndex
          ? ('current' as const)
          : ('upcoming' as const),
  }))
}

function ProgressTrack({ steps }: { steps: ProgressStep[] }) {
  return (
    <ol className="relative space-y-0">
      {steps.map((step, index) => (
        <li key={step.label} className="relative flex gap-3 pb-4 last:pb-0">
          {index < steps.length - 1 ? (
            <span
              aria-hidden
              className={cn(
                'absolute left-[0.6875rem] top-7 h-[calc(100%-0.75rem)] w-px',
                step.status === 'completed' ? 'bg-brand/50' : 'bg-line',
              )}
            />
          ) : null}
          <span
            className={cn(
              'relative z-10 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[0.625rem] font-semibold',
              step.status === 'completed' && 'border-brand bg-brand text-paper',
              step.status === 'current' && 'border-brand bg-brand-subtle text-brand',
              step.status === 'upcoming' && 'border-line bg-paper text-ink-muted',
            )}
          >
            {step.status === 'completed' ? <Check size={11} strokeWidth={3} /> : index + 1}
          </span>
          <div className="min-w-0 pt-0.5">
            <p
              className={cn(
                'text-[0.875rem] sm:text-[0.9375rem]',
                step.status === 'upcoming' ? 'text-ink-muted' : 'font-medium text-ink',
              )}
            >
              {step.label}
            </p>
            {step.status === 'current' ? (
              <p className="mt-0.5 text-[0.75rem] text-brand">{LABELS.bugCurrentStatus}</p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  )
}

export function BugReportDetail({ report, mode, backHref }: Props) {
  const verify = useVerifyBug(report.id)
  const triage = useTriageBugReport(report.id)
  const updateStatus = useUpdateBugStatus(report.id)
  const duplicate = useMarkBugDuplicate(report.id)
  const wontFix = useWontFixBug(report.id)
  const commentsQuery = useBugCommentsInfinite(report.id, { enabled: mode === 'admin' })
  const addComment = useAddBugComment(report.id)

  const [severity, setSeverity] = useState<BugReportSeverity>(
    report.severity ?? BUG_REPORT_SEVERITY.MEDIUM,
  )
  const [module, setModule] = useState<BugAffectedModule>(
    report.affectedModule ?? BUG_AFFECTED_MODULE.OTHER,
  )
  const [assigneeId, setAssigneeId] = useState(report.assignedToId ?? '')
  const [status, setStatus] = useState<BugReportStatus>(BUG_REPORT_STATUS.IN_PROGRESS)
  const [duplicateOfId, setDuplicateOfId] = useState('')
  const [wontFixReason, setWontFixReason] = useState('')
  const [comment, setComment] = useState('')
  const [error, setError] = useState<string | null>(null)

  const comments = useMemo(
    () => commentsQuery.data?.pages.flatMap((p) => p.items) ?? report.comments ?? [],
    [commentsQuery.data, report.comments],
  )

  const progress = useMemo(() => statusTimeline(report), [report])

  const appVersionDisplay =
    report.appVersion ||
    (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_APP_VERSION : undefined) ||
    LABELS.emptyCell

  const listHref =
    backHref ?? (mode === 'admin' ? PATHS.admin.bugReports : PATHS.bugReports)

  return (
    <div className="w-full min-w-0 space-y-4 sm:space-y-5 md:space-y-6">
      <div>
        <Link
          href={listHref}
          className="mb-2 inline-flex items-center gap-1 text-[0.8125rem] text-ink-muted transition-colors hover:text-brand sm:mb-3"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
          {LABELS.bugBackToList}
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-2 sm:gap-3">
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[0.6875rem] tabular-nums text-ink-faint sm:text-[0.75rem]">
              {report.reportNumber}
            </p>
            <h1 className="mt-0.5 font-display text-[1.25rem] font-semibold leading-tight tracking-tight text-ink sm:text-[1.5rem]">
              {report.title}
            </h1>
            <p className="mt-1.5 text-[0.8125rem] text-ink-muted">
              {LABELS.bugFiledOn} {formatOrderDate(report.createdAt)}
              {report.reporterName ? ` · ${report.reporterName}` : ''}
            </p>
          </div>
          <StatusBadge status={report.status} label={BUG_STATUS_LABEL[report.status]} />
        </div>
        {mode === 'admin' ? (
          <div className="mt-3 flex flex-wrap gap-2">
            <StatusBadge status={report.severity} label={BUG_SEVERITY_LABEL[report.severity]} />
            <StatusBadge
              status={report.affectedModule}
              label={BUG_MODULE_LABEL[report.affectedModule]}
            />
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-5 lg:gap-6">
        <div className="min-w-0 space-y-4 md:col-span-7 lg:col-span-8">
          <section className="relative border border-line bg-surface p-4 shadow-elevation-1 sm:p-5">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-brand/70 via-brand/30 to-transparent"
            />
            <TextEyebrow>{LABELS.bugDescription}</TextEyebrow>
            <p className="mt-2 whitespace-pre-wrap text-[0.9375rem] leading-relaxed text-ink">
              {report.description}
            </p>

            {report.stepsToReproduce ? (
              <div className="mt-4 border-t border-line/70 pt-4 sm:mt-5 sm:pt-5">
                <TextEyebrow>{LABELS.bugStepsToReproduce}</TextEyebrow>
                <p className="mt-2 whitespace-pre-wrap text-[0.875rem] leading-relaxed text-ink-muted">
                  {report.stepsToReproduce}
                </p>
              </div>
            ) : null}

            {report.attachments?.length ? (
              <div className="mt-4 border-t border-line/70 pt-4 sm:mt-5 sm:pt-5">
                <TextEyebrow>{LABELS.bugAttachmentsHeading}</TextEyebrow>
                <AttachmentGrid attachments={report.attachments} />
              </div>
            ) : null}

            {report.wontFixReason ? (
              <p className="mt-4 border border-line bg-paper/50 px-3 py-2.5 text-[0.875rem] text-ink-muted sm:mt-5 sm:px-4 sm:py-3">
                <span className="font-medium text-ink">{LABELS.bugWontFixReason}: </span>
                {report.wontFixReason}
              </p>
            ) : null}
          </section>
        </div>

        <aside className="min-w-0 space-y-4 md:col-span-5 lg:col-span-4">
          {mode === 'reporter' ? (
            <section className="border border-line bg-surface p-4 shadow-elevation-1 sm:p-5 md:sticky md:top-20">
              <TextEyebrow>{LABELS.bugProgress}</TextEyebrow>
              <p className="mt-1 text-[0.75rem] text-ink-muted sm:text-[0.8125rem]">
                {LABELS.bugProgressHint}
              </p>
              <div className="mt-4">
                <ProgressTrack steps={progress} />
              </div>
              {report.status === BUG_REPORT_STATUS.FIXED ? (
                <div className="mt-4 border border-brand/30 bg-brand-subtle/50 px-3 py-3 sm:mt-5 sm:px-4 sm:py-4">
                  <p className="text-[0.875rem] text-ink">{LABELS.bugVerifyHint}</p>
                  <Button
                    type="button"
                    className="mt-3"
                    loading={verify.isPending}
                    onClick={() => void verify.mutateAsync()}
                  >
                    {LABELS.bugVerifyFixed}
                  </Button>
                </div>
              ) : null}
            </section>
          ) : null}

          {mode === 'admin' ? (
            <section className="border border-line bg-surface shadow-elevation-1">
              <div className="border-b border-line/80 bg-paper/40 px-4 py-4 sm:px-5">
                <TextEyebrow brand>{LABELS.bugContextPanel}</TextEyebrow>
              </div>
              <dl className="grid gap-4 px-4 py-5 text-[0.875rem] sm:px-5">
                <div>
                  <dt className="text-ink-muted">{LABELS.bugPageUrl}</dt>
                  <dd className="mt-0.5 break-all text-ink">{report.pageUrl || LABELS.emptyCell}</dd>
                </div>
                <div>
                  <dt className="text-ink-muted">{LABELS.bugBrowser}</dt>
                  <dd className="mt-0.5 text-ink">{report.browserName || LABELS.emptyCell}</dd>
                </div>
                <div>
                  <dt className="text-ink-muted">{LABELS.bugOs}</dt>
                  <dd className="mt-0.5 text-ink">{report.osName || LABELS.emptyCell}</dd>
                </div>
                <div>
                  <dt className="text-ink-muted">{LABELS.bugDevice}</dt>
                  <dd className="mt-0.5 text-ink">{report.deviceType || LABELS.emptyCell}</dd>
                </div>
                <div>
                  <dt className="text-ink-muted">{LABELS.bugAppVersion}</dt>
                  <dd className="mt-0.5 text-ink">{appVersionDisplay}</dd>
                </div>
                <div>
                  <dt className="text-ink-muted">{LABELS.bugUserAgent}</dt>
                  <dd className="mt-0.5 break-all text-ink">{report.userAgent || LABELS.emptyCell}</dd>
                </div>
              </dl>
            </section>
          ) : null}
        </aside>
      </div>

      {mode === 'admin' ? (
        <>
          <section className="grid gap-0 overflow-hidden border border-line bg-surface shadow-elevation-1 lg:grid-cols-2">
            <div className="space-y-3 border-b border-line p-4 sm:p-5 lg:border-b-0 lg:border-r">
              <TextEyebrow>{LABELS.bugTriage}</TextEyebrow>
              <FormFieldFrame label={LABELS.bugSeverity}>
                <Select
                  value={severity}
                  onValueChange={(v) => setSeverity(v as BugReportSeverity)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BUG_REPORT_SEVERITY_VALUES.map((value) => (
                      <SelectItem key={value} value={value}>
                        {BUG_SEVERITY_LABEL[value]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormFieldFrame>
              <FormFieldFrame label={LABELS.bugAffectedModule}>
                <Select
                  value={module}
                  onValueChange={(v) => setModule(v as BugAffectedModule)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BUG_AFFECTED_MODULE_VALUES.map((value) => (
                      <SelectItem key={value} value={value}>
                        {BUG_MODULE_LABEL[value]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormFieldFrame>
              <FormFieldFrame label={LABELS.bugAssignToId}>
                <Input value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)} />
              </FormFieldFrame>
              <Button
                type="button"
                loading={triage.isPending}
                onClick={() =>
                  void triage.mutateAsync({
                    severity,
                    affectedModule: module,
                    assignedToId: assigneeId.trim() || null,
                  })
                }
              >
                {LABELS.bugTriageSubmit}
              </Button>
            </div>

            <div className="space-y-3 p-4 sm:p-5">
              <TextEyebrow>{LABELS.bugUpdateStatus}</TextEyebrow>
              <FormFieldFrame label={LABELS.status}>
                <Select
                  value={status}
                  onValueChange={(v) => setStatus(v as BugReportStatus)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ADMIN_STATUS_OPTIONS.map((value) => (
                      <SelectItem key={value} value={value}>
                        {BUG_STATUS_LABEL[value]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormFieldFrame>
              <Button
                type="button"
                variant="outline"
                loading={updateStatus.isPending}
                onClick={() => void updateStatus.mutateAsync(status)}
              >
                {LABELS.bugUpdateStatus}
              </Button>

              <FormFieldFrame label={LABELS.bugDuplicateOfId}>
                <Input
                  value={duplicateOfId}
                  onChange={(e) => setDuplicateOfId(e.target.value)}
                />
              </FormFieldFrame>
              <Button
                type="button"
                variant="outline"
                loading={duplicate.isPending}
                disabled={!duplicateOfId.trim()}
                onClick={() => void duplicate.mutateAsync(duplicateOfId.trim())}
              >
                {LABELS.bugMarkDuplicate}
              </Button>

              <FormFieldFrame label={LABELS.bugWontFixReason}>
                <Textarea
                  value={wontFixReason}
                  onChange={(e) =>
                    setWontFixReason(e.target.value.slice(0, BUG_WONT_FIX_REASON_MAX))
                  }
                  rows={3}
                  maxLength={BUG_WONT_FIX_REASON_MAX}
                />
                <p className="mt-1 text-[0.75rem] tabular-nums text-ink-muted">
                  {formatLabel(LABELS.ticketCharCounter, {
                    count: wontFixReason.length,
                    max: BUG_WONT_FIX_REASON_MAX,
                  })}
                </p>
              </FormFieldFrame>
              <Button
                type="button"
                variant="outline"
                loading={wontFix.isPending}
                disabled={!wontFixReason.trim()}
                onClick={() => void wontFix.mutateAsync(wontFixReason.trim())}
              >
                {LABELS.bugWontFixSubmit}
              </Button>
            </div>
          </section>

          <section className="overflow-hidden border border-line bg-surface shadow-elevation-1">
            <div className="border-b border-line/80 bg-paper/40 px-4 py-4 sm:px-6">
              <TextEyebrow>{LABELS.bugInternalComments}</TextEyebrow>
              <p className="mt-1 text-[0.8125rem] text-ink-muted">{LABELS.bugInternalCommentsHint}</p>
            </div>

            <div className="space-y-4 px-4 py-5 sm:px-6">
              {comments.length === 0 ? (
                <p className="border border-dashed border-line bg-paper/40 px-4 py-8 text-center text-[0.875rem] text-ink-muted">
                  {LABELS.bugNoCommentsYet}
                </p>
              ) : (
                <ul className="space-y-4">
                  {comments.map((c) => {
                    const name = c.authorName || LABELS.ticketMessageSupport
                    const parts = name.trim().split(/\s+/)
                    const initials =
                      ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase() || '?'
                    return (
                      <li key={c.id} className="flex gap-3">
                        <Avatar className="mt-0.5 h-9 w-9 shrink-0 border border-line">
                          <AvatarFallback className="bg-paper text-[0.75rem] font-semibold text-ink-muted">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1 border border-line bg-surface-raised px-3.5 py-2.5 shadow-[0_1px_0_rgba(15,23,42,0.03)]">
                          <div className="mb-1.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                            <span className="text-[0.8125rem] font-semibold text-ink">{name}</span>
                            <span className="text-[0.6875rem] text-ink-muted">
                              {formatOrderDate(c.createdAt)}
                            </span>
                          </div>
                          <p className="whitespace-pre-wrap text-[0.9375rem] leading-relaxed text-ink">
                            {c.body}
                          </p>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}

              {commentsQuery.hasNextPage ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  loading={commentsQuery.isFetchingNextPage}
                  onClick={() => void commentsQuery.fetchNextPage()}
                >
                  {LABELS.loadMore}
                </Button>
              ) : null}
            </div>

            <div className="space-y-3 border-t border-line bg-paper/30 px-4 py-4 sm:px-6">
              <FormFieldFrame label={LABELS.bugAddComment}>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value.slice(0, BUG_COMMENT_MAX))}
                  placeholder={LABELS.bugCommentPlaceholder}
                  rows={3}
                  className="min-h-[5rem] resize-y"
                  maxLength={BUG_COMMENT_MAX}
                />
                <p className="mt-1 text-[0.75rem] tabular-nums text-ink-muted">
                  {formatLabel(LABELS.ticketCharCounter, {
                    count: comment.length,
                    max: BUG_COMMENT_MAX,
                  })}
                </p>
              </FormFieldFrame>
              <FormError
                error={error ? new Error(error) : null}
                fallback={LABELS.bugCouldNotComment}
              />
              <div className="flex justify-end">
                <Button
                  type="button"
                  loading={addComment.isPending}
                  disabled={!comment.trim()}
                  onClick={async () => {
                    setError(null)
                    try {
                      await addComment.mutateAsync(comment.trim())
                      setComment('')
                    } catch (err) {
                      setError(getApiErrorMessage(err, LABELS.bugCouldNotComment))
                    }
                  }}
                >
                  {LABELS.bugAddComment}
                </Button>
              </div>
            </div>
          </section>
        </>
      ) : null}
    </div>
  )
}
