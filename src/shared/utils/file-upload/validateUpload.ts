import { LABELS } from "@/shared/constants/labels";
import {
  isAllowedUploadMime,
  type getImageUploadSpec,
} from "@/shared/constants/imageSpecs";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import type { FileUploadProps } from "../../types/file-upload/types";
import { isPdfFile, isVideoFile, mbLabel } from "./utils";

interface UploadRules {
  entityType: FileUploadProps["entityType"];
  purpose: FileUploadProps["purpose"];
  maxBytes: number;
  spec: ReturnType<typeof getImageUploadSpec>;
}

/** Why a chosen file cannot be uploaded (too large or the wrong type), or null. */
export function validateUploadFile(
  file: File,
  { entityType, purpose, maxBytes, spec }: UploadRules,
): string | null {
  if (file.size > maxBytes) {
    return formatLabel(LABELS.uploadTooLargeMb, { mb: mbLabel(maxBytes) });
  }
  const mime = file.type.toLowerCase();
  if (!isAllowedUploadMime(entityType, purpose, mime)) {
    if (spec?.mimeTypes.every((type) => type.startsWith("video/"))) {
      return LABELS.imageUploadInvalidVideoType;
    }
    return spec?.mimeTypes.includes("application/pdf")
      ? LABELS.imageUploadInvalidDocumentType
      : LABELS.uploadInvalidImageType;
  }
  return null;
}

/** Splits chosen files into those uploaded as they are and images to crop first. */
export function partitionForCrop(files: File[], cropRequired: boolean) {
  const directUpload: File[] = [];
  const cropCandidates: File[] = [];
  for (const file of files) {
    const needsCrop = cropRequired && !isPdfFile(file) && !isVideoFile(file);
    (needsCrop ? cropCandidates : directUpload).push(file);
  }
  return { directUpload, cropCandidates };
}

/** Why more files cannot be added: no room at all, or room for fewer than were chosen. */
export function uploadLimitMessage(max: number, remaining: number): string {
  return remaining === 0
    ? formatLabel(LABELS.uploadLimitFull, { max })
    : formatLabel(LABELS.uploadLimitReached, { max, remaining });
}
