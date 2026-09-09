"use client";

import { useState, type RefObject } from "react";
import { LABELS } from "@/shared/constants/labels";
import {
  isAllowedUploadMime,
  isVideoMimeType,
  maxBytesForUpload,
} from "@/shared/constants/imageSpecs";
import {
  UPLOAD_PURPOSE,
  type UploadEntityType,
} from "@/shared/constants/uploads/uploads";
import { usePresignUpload } from "@/shared/hooks/uploads/useUploads.hook";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import type { UploadedMediaAttachment } from "../../types/form/TicketAttachmentUploader-types";
import type { Mode } from "../../types/form/TicketAttachmentUploader-types";
import { mapBugType, mapTicketType, mbLabel } from "../../utils/form/TicketAttachmentUploader-utils";
import { prepareUpload } from "../../utils/form/prepareUpload";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";

export interface UseFileProcessorArgs {
  mode: Mode;
  entityType: UploadEntityType;
  entityId: string;
  value: UploadedMediaAttachment[];
  onChange: (next: UploadedMediaAttachment[]) => void;
  imageCount: number;
  videoCount: number;
  maxImages: number;
  maxVideos: number;
  maxVideoSeconds: number;
  fileRef: RefObject<HTMLInputElement | null>;
}

/** Validates, prepares, and uploads one attachment file (Rule 14 owner). */
export function useFileProcessor(args: UseFileProcessorArgs) {
  const {
    mode,
    entityType,
    entityId,
    value,
    onChange,
    imageCount,
    videoCount,
    maxImages,
    maxVideos,
    maxVideoSeconds,
    fileRef,
  } = args;
  const presign = usePresignUpload();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const purpose = UPLOAD_PURPOSE.ATTACHMENTS;

  const processFile = async (file: File) => {
    setError(null);
    setStatus(null);

    if (!isAllowedUploadMime(entityType, purpose, file.type)) {
      setError(LABELS.uploadInvalidImageType);
      return;
    }

    if (!hasAttachmentSlot(file.type)) {
      setError(
        mode === "bug"
          ? LABELS.bugAttachmentLimit
          : LABELS.ticketAttachmentLimit,
      );
      return;
    }

    const imageMax = maxBytesForUpload(entityType, purpose, file.type);
    if (!isVideoMimeType(file.type) && file.size > imageMax) {
      setError(formatLabel(LABELS.uploadTooLargeMb, { mb: mbLabel(imageMax) }));
      return;
    }

    setPending(true);
    try {
      if (isVideoMimeType(file.type)) {
        setStatus(
          mode === "bug"
            ? LABELS.bugCompressingVideo
            : LABELS.ticketCompressingVideo,
        );
      }
      const prepared = await prepareUpload({ file, mode, maxVideoSeconds });
      if (!prepared.ok) {
        setError(prepared.error);
        return;
      }

      const result = await presign.mutateAsync({
        entityType,
        entityId,
        purpose,
        filename: prepared.file.name,
        contentType: prepared.contentType,
        contentLength: prepared.file.size,
        file: prepared.file,
      });

      const ticketType = mapTicketType(prepared.file);
      const next: UploadedMediaAttachment = {
        url: result.url,
        type: ticketType,
        durationSeconds: prepared.durationSeconds,
        displayUrl: result.viewUrl ?? result.url,
        ...(mode === "bug" ? { bugType: mapBugType(prepared.file) } : {}),
      };
      onChange([...value, next]);
    } catch (err) {
      setError(getApiErrorMessage(err, LABELS.uploadFailed));
    } finally {
      setPending(false);
      setStatus(null);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  /** True when the media type still has a free image/video slot. */
  function hasAttachmentSlot(contentType: string): boolean {
    return isVideoMimeType(contentType)
      ? videoCount < maxVideos
      : imageCount < maxImages;
  }

  return { error, status, pending, processFile };
}
