'use client'

import { useId, useRef, useState } from 'react'
import { FormError } from '@/shared/components/FormError'
import { Button } from '@/shared/components/ui/button'
import { LABELS } from '@/shared/constants/labels'
import {
  getAcceptForUpload,
  getImageUploadHintKey,
  isAllowedUploadMime,
  isVideoMimeType,
  maxBytesForUpload,
  VIDEO_MIME_TYPES,
} from '@/shared/constants/imageSpecs'
import { UPLOAD_ENTITY, UPLOAD_PURPOSE, type UploadEntityType } from '@/shared/constants/uploads'
import {
  BUG_ATTACHMENT_TYPE,
  TICKET_ATTACHMENT_TYPE,
  type BugAttachmentType,
  type TicketAttachmentType,
} from '@/shared/constants/statuses'
import { usePresignUpload } from '@/features/uploads/api/uploads.queries'
import { formatLabel } from '@/shared/utils/formatLabel'
import { getApiErrorMessage } from '@/shared/utils/apiErrorMessage'
import { compressVideoIfNeeded } from '@/shared/utils/videoMedia'
import {
  BUG_MAX_RECORDING_SECONDS,
  BUG_MAX_RECORDINGS,
  BUG_MAX_SCREENSHOTS,
  MAX_IMAGE_BYTES,
  MAX_VIDEO_BYTES,
  TICKET_MAX_IMAGES,
  TICKET_MAX_VIDEO_SECONDS,
  TICKET_MAX_VIDEOS,
} from '@/shared/constants/mediaLimits'
import type { TicketAttachmentInput } from '../api/supportTickets.api'

export type UploadedMediaAttachment = TicketAttachmentInput & {
  displayUrl?: string
  /** Bug reports use SCREENSHOT / SCREEN_RECORDING */
  bugType?: BugAttachmentType
}

type Mode = 'ticket' | 'bug'

type Props = {
  mode?: Mode
  entityType?: UploadEntityType
  entityId: string
  value: UploadedMediaAttachment[]
  onChange: (next: UploadedMediaAttachment[]) => void
  disabled?: boolean
  label?: string
  /** Attachments already on the ticket/report (reply path). */
  existingImageCount?: number
  existingVideoCount?: number
}

function mbLabel(bytes: number): string {
  const mb = bytes / (1024 * 1024)
  return mb % 1 === 0 ? String(mb) : mb.toFixed(1)
}

function mapTicketType(file: File): TicketAttachmentType {
  return isVideoMimeType(file.type) ? TICKET_ATTACHMENT_TYPE.VIDEO : TICKET_ATTACHMENT_TYPE.IMAGE
}

function mapBugType(file: File): BugAttachmentType {
  return isVideoMimeType(file.type)
    ? BUG_ATTACHMENT_TYPE.SCREEN_RECORDING
    : BUG_ATTACHMENT_TYPE.SCREENSHOT
}

function isVideoAttachment(item: UploadedMediaAttachment): boolean {
  if (item.bugType) return item.bugType === BUG_ATTACHMENT_TYPE.SCREEN_RECORDING
  return item.type === TICKET_ATTACHMENT_TYPE.VIDEO
}

export function TicketAttachmentUploader({
  mode = 'ticket',
  entityType = mode === 'bug' ? UPLOAD_ENTITY.BUG_REPORTS : UPLOAD_ENTITY.TICKETS,
  entityId,
  value,
  onChange,
  disabled,
  label,
  existingImageCount = 0,
  existingVideoCount = 0,
}: Props) {
  const inputId = useId()
  const fileRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const presign = usePresignUpload()

  const purpose = UPLOAD_PURPOSE.ATTACHMENTS
  const accept = getAcceptForUpload(entityType, purpose)
  const hintKey = getImageUploadHintKey(entityType, purpose)
  const hintText = hintKey ? formatLabel(LABELS[hintKey], { mb: '5' }) : null

  const maxImages = mode === 'bug' ? BUG_MAX_SCREENSHOTS : TICKET_MAX_IMAGES
  const maxVideos = mode === 'bug' ? BUG_MAX_RECORDINGS : TICKET_MAX_VIDEOS
  const maxVideoSeconds = mode === 'bug' ? BUG_MAX_RECORDING_SECONDS : TICKET_MAX_VIDEO_SECONDS

  const imageCount = existingImageCount + value.filter((a) => !isVideoAttachment(a)).length
  const videoCount = existingVideoCount + value.filter((a) => isVideoAttachment(a)).length

  const processFile = async (file: File) => {
    setError(null)
    setStatus(null)

    if (!isAllowedUploadMime(entityType, purpose, file.type)) {
      setError(LABELS.uploadInvalidImageType)
      return
    }

    const video = isVideoMimeType(file.type)
    if (video) {
      if (videoCount >= maxVideos) {
        setError(mode === 'bug' ? LABELS.bugAttachmentLimit : LABELS.ticketAttachmentLimit)
        return
      }
    } else if (imageCount >= maxImages) {
      setError(mode === 'bug' ? LABELS.bugAttachmentLimit : LABELS.ticketAttachmentLimit)
      return
    }

    const imageMax = maxBytesForUpload(entityType, purpose, file.type)
    if (!video && file.size > imageMax) {
      setError(formatLabel(LABELS.uploadTooLargeMb, { mb: mbLabel(imageMax) }))
      return
    }

    setPending(true)
    try {
      let uploadFile = file
      let durationSeconds: number | null = null

      if (video) {
        setStatus(mode === 'bug' ? LABELS.bugCompressingVideo : LABELS.ticketCompressingVideo)
        const prepared = await compressVideoIfNeeded(file, maxVideoSeconds, MAX_VIDEO_BYTES)
        if (!prepared.ok) {
          if (prepared.reason === 'TOO_LONG') {
            setError(
              formatLabel(
                mode === 'bug' ? LABELS.bugVideoTooLong : LABELS.ticketVideoTooLong,
                { seconds: maxVideoSeconds },
              ),
            )
          } else if (prepared.reason === 'TOO_LARGE') {
            setError(
              formatLabel(
                mode === 'bug' ? LABELS.bugVideoTooLarge : LABELS.ticketVideoTooLarge,
                { mb: mbLabel(MAX_VIDEO_BYTES) },
              ),
            )
          } else {
            setError(mode === 'bug' ? LABELS.bugCompressFailed : LABELS.ticketCompressFailed)
          }
          return
        }
        uploadFile = prepared.file
        durationSeconds = prepared.durationSeconds
        setStatus(null)
      } else if (file.size > MAX_IMAGE_BYTES) {
        setError(formatLabel(LABELS.uploadTooLargeMb, { mb: mbLabel(MAX_IMAGE_BYTES) }))
        return
      }

      const result = await presign.mutateAsync({
        entityType,
        entityId,
        purpose,
        filename: uploadFile.name,
        contentType: uploadFile.type || (video ? VIDEO_MIME_TYPES[0] : 'image/jpeg'),
        contentLength: uploadFile.size,
        file: uploadFile,
      })

      const ticketType = mapTicketType(uploadFile)
      const next: UploadedMediaAttachment = {
        url: result.url,
        type: ticketType,
        durationSeconds,
        displayUrl: result.viewUrl ?? result.url,
        ...(mode === 'bug' ? { bugType: mapBugType(uploadFile) } : {}),
      }
      onChange([...value, next])
    } catch (err) {
      setError(getApiErrorMessage(err, LABELS.uploadFailed))
    } finally {
      setPending(false)
      setStatus(null)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const onPick = (list: FileList | null) => {
    if (!list?.length) return
    void processFile(list[0]!)
  }

  const removeAt = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-2">
      {label ? <p className="text-[0.8125rem] font-medium text-ink">{label}</p> : null}
      {hintText ? (
        <p className="text-[0.8125rem] leading-snug text-ink-muted">{hintText}</p>
      ) : null}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || pending || !entityId}
          onClick={() => fileRef.current?.click()}
        >
          {pending ? LABELS.uploading : LABELS.uploadFiles}
        </Button>
        <input
          id={inputId}
          ref={fileRef}
          type="file"
          className="sr-only"
          accept={accept}
          disabled={disabled || pending}
          onChange={(e) => onPick(e.target.files)}
        />
      </div>
      <p className="text-[0.75rem] tabular-nums text-ink-muted">
        {formatLabel(LABELS.attachmentCounter, {
          count: imageCount,
          max: maxImages,
          videoCount,
          videoMax: maxVideos,
        })}
      </p>
      {status ? <p className="text-[0.8125rem] text-ink-muted">{status}</p> : null}
      {value.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {value.map((item, index) => (
            <li
              key={`${item.url}-${index}`}
              className="relative h-20 w-20 overflow-hidden border border-line bg-paper"
            >
              {isVideoAttachment(item) ? (
                <video
                  src={item.displayUrl ?? item.url}
                  className="h-full w-full object-cover"
                  muted
                  playsInline
                  preload="metadata"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.displayUrl ?? item.url}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              )}
              <button
                type="button"
                className="absolute inset-x-0 bottom-0 bg-ink/70 px-1 py-0.5 text-[0.625rem] text-paper"
                onClick={() => removeAt(index)}
              >
                {LABELS.ticketRemoveAttachment}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      <FormError error={error ? new Error(error) : null} fallback={LABELS.uploadFailed} />
    </div>
  )
}

/** Alias for bug reports with SCREENSHOT / SCREEN_RECORDING mapping. */
export function BugAttachmentUploader(props: Omit<Props, 'mode' | 'entityType'>) {
  return (
    <TicketAttachmentUploader
      {...props}
      mode="bug"
      entityType={UPLOAD_ENTITY.BUG_REPORTS}
    />
  )
}
