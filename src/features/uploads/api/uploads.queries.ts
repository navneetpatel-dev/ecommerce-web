import { useMutation } from '@tanstack/react-query'
import {
  putFileToPresignedUrl,
  uploadsApi,
  type PresignBulkBody,
  type PresignSingleBody,
  type UploadBulkBody,
  type UploadSingleBody,
} from './uploads.api'

export function usePresignUpload() {
  return useMutation({
    mutationFn: async (body: PresignSingleBody & { file: File }) => {
      const presign = await uploadsApi.presign({
        entityType: body.entityType,
        entityId: body.entityId,
        purpose: body.purpose,
        filename: body.filename,
        contentType: body.contentType,
      })
      await putFileToPresignedUrl(presign.uploadUrl, body.file, body.contentType)
      return presign
    },
  })
}

export function usePresignUploadBulk() {
  return useMutation({
    mutationFn: async (body: PresignBulkBody & { fileObjects: File[] }) => {
      const presign = await uploadsApi.presignBulk({
        entityType: body.entityType,
        entityId: body.entityId,
        purpose: body.purpose,
        files: body.files,
      })

      const uploaded: typeof presign.items = []
      const errors = [...presign.errors]

      for (const item of presign.items) {
        const file = body.fileObjects[item.index]
        if (!file) continue
        try {
          await putFileToPresignedUrl(
            item.uploadUrl,
            file,
            file.type || 'application/octet-stream',
          )
          uploaded.push(item)
        } catch (error) {
          errors.push({
            index: item.index,
            message: error instanceof Error ? error.message : 'Upload failed',
          })
        }
      }

      return { items: uploaded, errors }
    },
  })
}

/** Fallback server-side upload when pre-signed PUT is unavailable. */
export function useUploadFile() {
  return useMutation({
    mutationFn: (body: UploadSingleBody) => uploadsApi.upload(body),
  })
}

export function useUploadFilesBulk() {
  return useMutation({
    mutationFn: (body: UploadBulkBody) => uploadsApi.uploadBulk(body),
  })
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result ?? ''))
    reader.onerror = () => reject(reader.error ?? new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}
