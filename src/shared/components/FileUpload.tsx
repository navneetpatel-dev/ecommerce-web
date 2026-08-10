'use client'

import { useRef, useState } from 'react'
import { FormError } from '@/shared/components/FormError'
import { Button } from '@/shared/components/ui/button'
import { LABELS } from '@/shared/constants/labels'
import { MAX_UPLOAD_BYTES } from '@/shared/constants/uploads'
import { usePresignUpload, usePresignUploadBulk } from '@/features/uploads/api/uploads.queries'
import type { UploadEntityType, UploadPurpose } from '@/shared/constants/uploads'
import { formatLabel } from '@/shared/utils/formatLabel'

type PreviewEntry = { storedUrl: string; displayUrl: string }

type SingleProps = {
  mode?: 'single'
  entityType: UploadEntityType
  entityId: string
  purpose: UploadPurpose
  accept?: string
  maxBytes?: number
  disabled?: boolean
  valueUrl?: string | null
  onUploaded: (url: string) => void
  label?: string
}

type MultiProps = {
  mode: 'multiple'
  entityType: UploadEntityType
  entityId: string
  purpose: UploadPurpose
  accept?: string
  maxBytes?: number
  disabled?: boolean
  valueUrls?: string[]
  onUploaded: (urls: string[]) => void
  label?: string
}

export type FileUploadProps = SingleProps | MultiProps

function isPdfUrl(url: string): boolean {
  return /\.pdf($|\?)/i.test(url)
}

/**
 * Phase-1 uploader — pre-signed PUT to S3, returns URL(s) for Phase-2 attach.
 */
export function FileUpload(props: FileUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [previews, setPreviews] = useState<PreviewEntry[]>([])
  const presignOne = usePresignUpload()
  const presignBulk = usePresignUploadBulk()

  const isMultiple = props.mode === 'multiple'
  const pending = presignOne.isPending || presignBulk.isPending
  const maxBytes = props.maxBytes ?? MAX_UPLOAD_BYTES
  const accept = props.accept ?? 'image/png,image/jpeg,image/webp,image/jpg,application/pdf'

  const validate = (file: File): string | null => {
    if (file.size > maxBytes) {
      return formatLabel(LABELS.uploadTooLargeMb, { mb: String(Math.round(maxBytes / (1024 * 1024))) })
    }
    return null
  }

  const onPick = async (list: FileList | null) => {
    if (!list?.length) return
    setError(null)

    const files = Array.from(list)
    for (const file of files) {
      const validationError = validate(file)
      if (validationError) {
        setError(validationError)
        return
      }
    }

    try {
      if (isMultiple) {
        const result = await presignBulk.mutateAsync({
          entityType: props.entityType,
          entityId: props.entityId,
          purpose: props.purpose,
          files: files.map((file) => ({
            filename: file.name,
            contentType: file.type || 'application/octet-stream',
          })),
          fileObjects: files,
        })

        if (result.errors.length) {
          setError(
            result.errors
              .map((e) =>
                formatLabel(LABELS.uploadFileFailedAt, {
                  index: String(e.index + 1),
                  message: e.message,
                }),
              )
              .join(' '),
          )
        }

        if (result.items.length) {
          const newEntries = result.items.map((item) => ({
            storedUrl: item.url,
            displayUrl: item.viewUrl ?? item.url,
          }))
          setPreviews((prev) => [...prev, ...newEntries])
          props.onUploaded([
            ...(props.valueUrls ?? []),
            ...result.items.map((item) => item.url),
          ])
        }
      } else {
        const file = files[0]!
        const result = await presignOne.mutateAsync({
          entityType: props.entityType,
          entityId: props.entityId,
          purpose: props.purpose,
          filename: file.name,
          contentType: file.type || 'application/octet-stream',
          file,
        })
        setPreviews([{ storedUrl: result.url, displayUrl: result.viewUrl ?? result.url }])
        props.onUploaded(result.url)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : LABELS.uploadFailed)
    } finally {
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const previewEntries: PreviewEntry[] = isMultiple
    ? [
        ...(props.valueUrls ?? []).map((storedUrl) => {
          const known = previews.find((p) => p.storedUrl === storedUrl)
          return known ?? { storedUrl, displayUrl: storedUrl }
        }),
        ...previews.filter((p) => !(props.valueUrls ?? []).includes(p.storedUrl)),
      ]
    : props.valueUrl
      ? [
          previews.find((p) => p.storedUrl === props.valueUrl) ?? {
            storedUrl: props.valueUrl,
            displayUrl: props.valueUrl,
          },
        ]
      : previews

  return (
    <div className="space-y-2">
      {props.label ? (
        <p className="text-[0.8125rem] font-medium text-ink">{props.label}</p>
      ) : null}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={props.disabled || pending || !props.entityId}
          onClick={() => fileRef.current?.click()}
        >
          {pending ? LABELS.uploading : isMultiple ? LABELS.uploadFiles : LABELS.uploadFile}
        </Button>
        <input
          ref={fileRef}
          type="file"
          className="sr-only"
          accept={accept}
          multiple={isMultiple}
          disabled={props.disabled || pending}
          onChange={(e) => void onPick(e.target.files)}
        />
      </div>
      {previewEntries.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {previewEntries.map((entry) =>
            isPdfUrl(entry.displayUrl) ? (
              <li
                key={entry.storedUrl}
                className="flex h-16 min-w-[4rem] items-center justify-center border border-line bg-paper px-2 text-[0.6875rem] text-ink-muted"
              >
                PDF
              </li>
            ) : (
              <li key={entry.storedUrl} className="relative h-16 w-16 overflow-hidden border border-line bg-paper">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={entry.displayUrl} alt="" className="h-full w-full object-cover" />
              </li>
            ),
          )}
        </ul>
      ) : null}
      <FormError error={error ? new Error(error) : null} fallback={LABELS.uploadFailed} />
    </div>
  )
}
