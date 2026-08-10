import { apiClient } from '@/shared/api/client'
import { API } from '@/shared/constants/apiRoutes'
import type { UploadEntityType, UploadPurpose } from '@/shared/constants/uploads'

export type UploadFilePayload = {
  dataUrl: string
  filename?: string
}

export type UploadSingleBody = {
  entityType: UploadEntityType
  entityId: string
  purpose: UploadPurpose
  file: UploadFilePayload
}

export type UploadBulkBody = {
  entityType: UploadEntityType
  entityId: string
  purpose: UploadPurpose
  files: UploadFilePayload[]
}

export type PresignFilePayload = {
  filename: string
  contentType: string
  /** Exact byte length — must match the File body PUT to S3. */
  contentLength: number
}

export type PresignSingleBody = {
  entityType: UploadEntityType
  entityId: string
  purpose: UploadPurpose
  filename: string
  contentType: string
  /** Exact byte length — must match the File body PUT to S3. */
  contentLength: number
}

export type PresignBulkBody = {
  entityType: UploadEntityType
  entityId: string
  purpose: UploadPurpose
  files: PresignFilePayload[]
}

export type UploadSingleResult = { url: string; viewUrl?: string }

export type PresignSingleResult = {
  uploadUrl: string
  url: string
  viewUrl?: string
  key: string
}

export type PresignBulkResult = {
  items: Array<{ index: number; uploadUrl: string; url: string; viewUrl?: string; key: string }>
  errors: Array<{ index: number; message: string }>
}

export type UploadBulkResult = {
  urls: string[]
  viewUrls?: string[]
  errors: Array<{ index: number; message: string }>
}

export const uploadsApi = {
  presign: (body: PresignSingleBody) =>
    apiClient.post<PresignSingleResult>(API.uploads.presign, body),
  presignBulk: (body: PresignBulkBody) =>
    apiClient.post<PresignBulkResult>(API.uploads.presignBulk, body),
  upload: (body: UploadSingleBody) =>
    apiClient.post<UploadSingleResult>(API.uploads.root, body),
  uploadBulk: (body: UploadBulkBody) =>
    apiClient.post<UploadBulkResult>(API.uploads.bulk, body),
}

/** PUT file bytes to a pre-signed URL (Phase 1). */
export async function putFileToPresignedUrl(
  uploadUrl: string,
  file: File,
  contentType: string,
): Promise<void> {
  const res = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': contentType },
    body: file,
  })
  if (!res.ok) {
    throw new Error(`Upload failed (${res.status})`)
  }
}
