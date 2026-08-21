import { MAX_UPLOAD_BYTES } from "@/shared/constants/uploads";
import type {
  UploadEntityType,
  UploadPurpose,
} from "@/shared/constants/uploads";
import {
  IMAGE_MIME_TYPES,
  IMAGE_UPLOAD_HINT_KEYS,
  IMAGE_UPLOAD_SPECS,
  VIDEO_MIME_TYPES,
} from "./specs";
import type {
  ImageMimeType,
  ImageUploadHintKey,
  ImageUploadSpec,
} from "./specs";

export function imageUploadSpecKey(
  entityType: UploadEntityType,
  purpose: UploadPurpose,
): string {
  return `${entityType}:${purpose}`;
}

export function getImageUploadSpec(
  entityType: UploadEntityType,
  purpose: UploadPurpose,
): ImageUploadSpec | null {
  return IMAGE_UPLOAD_SPECS[imageUploadSpecKey(entityType, purpose)] ?? null;
}

export function getImageUploadHintKey(
  entityType: UploadEntityType,
  purpose: UploadPurpose,
): ImageUploadHintKey | null {
  return (
    IMAGE_UPLOAD_HINT_KEYS[imageUploadSpecKey(entityType, purpose)] ?? null
  );
}

export function getAcceptForUpload(
  entityType: UploadEntityType,
  purpose: UploadPurpose,
): string {
  const spec = getImageUploadSpec(entityType, purpose);
  if (!spec) return IMAGE_MIME_TYPES.join(",");
  return spec.mimeTypes.join(",");
}

export function isVideoMimeType(mime: string): boolean {
  const normalized = mime.split(";")[0]?.trim().toLowerCase() ?? "";
  return (VIDEO_MIME_TYPES as readonly string[]).includes(normalized);
}

export function maxBytesForUpload(
  entityType: UploadEntityType,
  purpose: UploadPurpose,
  contentType?: string,
): number {
  const spec = getImageUploadSpec(entityType, purpose);
  if (!spec) return MAX_UPLOAD_BYTES;
  if (
    contentType &&
    isVideoMimeType(contentType) &&
    spec.videoMaxBytes != null
  ) {
    return spec.videoMaxBytes;
  }
  return spec.maxBytes;
}

export function isAllowedUploadMime(
  entityType: UploadEntityType,
  purpose: UploadPurpose,
  mime: string,
): boolean {
  const spec = getImageUploadSpec(entityType, purpose);
  if (!spec) return IMAGE_MIME_TYPES.includes(mime as ImageMimeType);
  const normalized = mime.split(";")[0]?.trim().toLowerCase() ?? "";
  return spec.mimeTypes.includes(normalized);
}
