import { LABELS } from "@/shared/constants/labels";
import {
  isVideoMimeType,
  VIDEO_MIME_TYPES,
} from "@/shared/constants/imageSpecs";
import {
  MAX_IMAGE_BYTES,
  MAX_VIDEO_BYTES,
} from "@/shared/constants/mediaLimits";
import { compressVideoIfNeeded } from "@/shared/utils/videoMedia";
import { formatLabel } from "@/shared/utils/formatLabel";
import { mbLabel } from "./utils";
import type { Mode } from "./types";

export type PrepareUploadResult =
  | {
      ok: true;
      file: File;
      durationSeconds: number | null;
      contentType: string;
    }
  | { ok: false; error: string };

export interface PrepareUploadArgs {
  file: File;
  mode: Mode;
  maxVideoSeconds: number;
}

/**
 * Validates size limits and compresses video attachments before upload
 * (async util — Rule 1). Returns either the prepared upload payload or a
 * localized, mode-aware error message.
 */
export async function prepareUpload(
  args: PrepareUploadArgs,
): Promise<PrepareUploadResult> {
  const { file, mode, maxVideoSeconds } = args;
  const video = isVideoMimeType(file.type);

  if (!video) {
    if (file.size > MAX_IMAGE_BYTES) {
      return {
        ok: false,
        error: formatLabel(LABELS.uploadTooLargeMb, {
          mb: mbLabel(MAX_IMAGE_BYTES),
        }),
      };
    }
    return {
      ok: true,
      file,
      durationSeconds: null,
      contentType: file.type || "image/jpeg",
    };
  }

  const prepared = await compressVideoIfNeeded(
    file,
    maxVideoSeconds,
    MAX_VIDEO_BYTES,
  );
  if (!prepared.ok) {
    if (prepared.reason === "TOO_LONG") {
      return {
        ok: false,
        error: formatLabel(
          mode === "bug" ? LABELS.bugVideoTooLong : LABELS.ticketVideoTooLong,
          { seconds: maxVideoSeconds },
        ),
      };
    }
    if (prepared.reason === "TOO_LARGE") {
      return {
        ok: false,
        error: formatLabel(
          mode === "bug" ? LABELS.bugVideoTooLarge : LABELS.ticketVideoTooLarge,
          { mb: mbLabel(MAX_VIDEO_BYTES) },
        ),
      };
    }
    return {
      ok: false,
      error:
        mode === "bug" ? LABELS.bugCompressFailed : LABELS.ticketCompressFailed,
    };
  }

  return {
    ok: true,
    file: prepared.file,
    durationSeconds: prepared.durationSeconds,
    contentType: prepared.file.type || VIDEO_MIME_TYPES[0],
  };
}
