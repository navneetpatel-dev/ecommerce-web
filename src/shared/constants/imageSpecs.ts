import {
  MAX_AVATAR_UPLOAD_BYTES,
  MAX_UPLOAD_BYTES,
  MAX_VIDEO_UPLOAD_BYTES,
} from '@/shared/constants/uploads'
import type { UploadEntityType, UploadPurpose } from '@/shared/constants/uploads'

export const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const
export const DOCUMENT_MIME_TYPES = [...IMAGE_MIME_TYPES, 'application/pdf'] as const
export const VIDEO_MIME_TYPES = ['video/mp4', 'video/webm'] as const

export type ImageMimeType = (typeof IMAGE_MIME_TYPES)[number]

export interface ImageUploadSpec {
  outputWidth: number
  outputHeight: number
  aspectRatio: number
  maxBytes: number
  /** Optional higher ceiling for video mime types under the same purpose. */
  videoMaxBytes?: number
  mimeTypes: readonly string[]
  cropRequired: boolean
}

const LOGO_MAX_BYTES = 2 * 1024 * 1024
const ATTACHMENT_MEDIA_TYPES = [...IMAGE_MIME_TYPES, ...VIDEO_MIME_TYPES] as const

/** Mirrors backend `IMAGE_UPLOAD_SPECS` in `backend/src/core/s3/imageSpecs.ts`. */
export const IMAGE_UPLOAD_SPECS: Record<string, ImageUploadSpec> = {
  'banners:image': {
    outputWidth: 1920,
    outputHeight: 1080,
    aspectRatio: 16 / 9,
    maxBytes: MAX_UPLOAD_BYTES,
    mimeTypes: IMAGE_MIME_TYPES,
    cropRequired: true,
  },
  'categories:image': {
    outputWidth: 1200,
    outputHeight: 900,
    aspectRatio: 4 / 3,
    maxBytes: MAX_UPLOAD_BYTES,
    mimeTypes: IMAGE_MIME_TYPES,
    cropRequired: true,
  },
  'products:images': {
    outputWidth: 1200,
    outputHeight: 1200,
    aspectRatio: 1,
    maxBytes: MAX_UPLOAD_BYTES,
    mimeTypes: IMAGE_MIME_TYPES,
    cropRequired: true,
  },
  'vendors:logo': {
    outputWidth: 512,
    outputHeight: 512,
    aspectRatio: 1,
    maxBytes: LOGO_MAX_BYTES,
    mimeTypes: IMAGE_MIME_TYPES,
    cropRequired: true,
  },
  'vendors:banner': {
    outputWidth: 1680,
    outputHeight: 525,
    aspectRatio: 16 / 5,
    maxBytes: MAX_UPLOAD_BYTES,
    mimeTypes: IMAGE_MIME_TYPES,
    cropRequired: true,
  },
  'users:avatar': {
    outputWidth: 512,
    outputHeight: 512,
    aspectRatio: 1,
    maxBytes: MAX_AVATAR_UPLOAD_BYTES,
    mimeTypes: IMAGE_MIME_TYPES,
    cropRequired: true,
  },
  'returns:photos': {
    outputWidth: 1600,
    outputHeight: 1200,
    aspectRatio: 4 / 3,
    maxBytes: MAX_UPLOAD_BYTES,
    mimeTypes: IMAGE_MIME_TYPES,
    cropRequired: true,
  },
  'vendors:kyc': {
    outputWidth: 0,
    outputHeight: 0,
    aspectRatio: 0,
    maxBytes: MAX_UPLOAD_BYTES,
    mimeTypes: DOCUMENT_MIME_TYPES,
    cropRequired: false,
  },
  'tickets:attachments': {
    outputWidth: 0,
    outputHeight: 0,
    aspectRatio: 0,
    maxBytes: MAX_UPLOAD_BYTES,
    videoMaxBytes: MAX_VIDEO_UPLOAD_BYTES,
    mimeTypes: ATTACHMENT_MEDIA_TYPES,
    cropRequired: false,
  },
  'bug-reports:attachments': {
    outputWidth: 0,
    outputHeight: 0,
    aspectRatio: 0,
    maxBytes: MAX_UPLOAD_BYTES,
    videoMaxBytes: MAX_VIDEO_UPLOAD_BYTES,
    mimeTypes: ATTACHMENT_MEDIA_TYPES,
    cropRequired: false,
  },
}

export type ImageUploadHintKey =
  | 'imageUploadHintPromoBanner'
  | 'imageUploadHintCategory'
  | 'imageUploadHintProduct'
  | 'imageUploadHintVendorLogo'
  | 'imageUploadHintVendorBanner'
  | 'imageUploadHintAvatar'
  | 'imageUploadHintReturnPhoto'
  | 'imageUploadHintKyc'
  | 'imageUploadHintTicketAttachment'
  | 'imageUploadHintBugAttachment'

const IMAGE_UPLOAD_HINT_KEYS: Record<string, ImageUploadHintKey> = {
  'banners:image': 'imageUploadHintPromoBanner',
  'categories:image': 'imageUploadHintCategory',
  'products:images': 'imageUploadHintProduct',
  'vendors:logo': 'imageUploadHintVendorLogo',
  'vendors:banner': 'imageUploadHintVendorBanner',
  'users:avatar': 'imageUploadHintAvatar',
  'returns:photos': 'imageUploadHintReturnPhoto',
  'vendors:kyc': 'imageUploadHintKyc',
  'tickets:attachments': 'imageUploadHintTicketAttachment',
  'bug-reports:attachments': 'imageUploadHintBugAttachment',
}

export function imageUploadSpecKey(entityType: UploadEntityType, purpose: UploadPurpose): string {
  return `${entityType}:${purpose}`
}

export function getImageUploadSpec(
  entityType: UploadEntityType,
  purpose: UploadPurpose,
): ImageUploadSpec | null {
  return IMAGE_UPLOAD_SPECS[imageUploadSpecKey(entityType, purpose)] ?? null
}

export function getImageUploadHintKey(
  entityType: UploadEntityType,
  purpose: UploadPurpose,
): ImageUploadHintKey | null {
  return IMAGE_UPLOAD_HINT_KEYS[imageUploadSpecKey(entityType, purpose)] ?? null
}

export function getAcceptForUpload(entityType: UploadEntityType, purpose: UploadPurpose): string {
  const spec = getImageUploadSpec(entityType, purpose)
  if (!spec) return IMAGE_MIME_TYPES.join(',')
  return spec.mimeTypes.join(',')
}

export function isVideoMimeType(mime: string): boolean {
  const normalized = mime.split(';')[0]?.trim().toLowerCase() ?? ''
  return (VIDEO_MIME_TYPES as readonly string[]).includes(normalized)
}

export function maxBytesForUpload(
  entityType: UploadEntityType,
  purpose: UploadPurpose,
  contentType?: string,
): number {
  const spec = getImageUploadSpec(entityType, purpose)
  if (!spec) return MAX_UPLOAD_BYTES
  if (contentType && isVideoMimeType(contentType) && spec.videoMaxBytes != null) {
    return spec.videoMaxBytes
  }
  return spec.maxBytes
}

export function isAllowedUploadMime(
  entityType: UploadEntityType,
  purpose: UploadPurpose,
  mime: string,
): boolean {
  const spec = getImageUploadSpec(entityType, purpose)
  if (!spec) return IMAGE_MIME_TYPES.includes(mime as ImageMimeType)
  const normalized = mime.split(';')[0]?.trim().toLowerCase() ?? ''
  return spec.mimeTypes.includes(normalized)
}
