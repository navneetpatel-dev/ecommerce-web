"use client";

import { useState, type RefObject } from "react";
import { LABELS } from "@/shared/constants/labels";
import {
  isAllowedUploadMime,
  isVideoMimeType,
  maxBytesForUpload,
  VIDEO_MIME_TYPES,
} from "@/shared/constants/imageSpecs";
import { UPLOAD_PURPOSE, type UploadEntityType } from "@/shared/constants/uploads";
import { usePresignUpload } from "@/shared/hooks/useUploads";
import { formatLabel } from "@/shared/utils/formatLabel";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import { compressVideoIfNeeded } from "@/shared/utils/videoMedia";
import { MAX_IMAGE_BYTES, MAX_VIDEO_BYTES } from "@/shared/constants/mediaLimits";
import type { Mode, UploadedMediaAttachment } from "./types";
import { mapBugType, mapTicketType, mbLabel } from "./utils";

type Args = {
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
};

export function useFileProcessor({
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
}: Args) {
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

    const video = isVideoMimeType(file.type);
    if (video) {
      if (videoCount >= maxVideos) {
        setError(
          mode === "bug"
            ? LABELS.bugAttachmentLimit
            : LABELS.ticketAttachmentLimit,
        );
        return;
      }
    } else if (imageCount >= maxImages) {
      setError(
        mode === "bug"
          ? LABELS.bugAttachmentLimit
          : LABELS.ticketAttachmentLimit,
      );
      return;
    }

    const imageMax = maxBytesForUpload(entityType, purpose, file.type);
    if (!video && file.size > imageMax) {
      setError(formatLabel(LABELS.uploadTooLargeMb, { mb: mbLabel(imageMax) }));
      return;
    }

    setPending(true);
    try {
      let uploadFile = file;
      let durationSeconds: number | null = null;

      if (video) {
        setStatus(
          mode === "bug"
            ? LABELS.bugCompressingVideo
            : LABELS.ticketCompressingVideo,
        );
        const prepared = await compressVideoIfNeeded(
          file,
          maxVideoSeconds,
          MAX_VIDEO_BYTES,
        );
        if (!prepared.ok) {
          if (prepared.reason === "TOO_LONG") {
            setError(
              formatLabel(
                mode === "bug"
                  ? LABELS.bugVideoTooLong
                  : LABELS.ticketVideoTooLong,
                { seconds: maxVideoSeconds },
              ),
            );
          } else if (prepared.reason === "TOO_LARGE") {
            setError(
              formatLabel(
                mode === "bug"
                  ? LABELS.bugVideoTooLarge
                  : LABELS.ticketVideoTooLarge,
                { mb: mbLabel(MAX_VIDEO_BYTES) },
              ),
            );
          } else {
            setError(
              mode === "bug"
                ? LABELS.bugCompressFailed
                : LABELS.ticketCompressFailed,
            );
          }
          return;
        }
        uploadFile = prepared.file;
        durationSeconds = prepared.durationSeconds;
        setStatus(null);
      } else if (file.size > MAX_IMAGE_BYTES) {
        setError(
          formatLabel(LABELS.uploadTooLargeMb, {
            mb: mbLabel(MAX_IMAGE_BYTES),
          }),
        );
        return;
      }

      const result = await presign.mutateAsync({
        entityType,
        entityId,
        purpose,
        filename: uploadFile.name,
        contentType:
          uploadFile.type || (video ? VIDEO_MIME_TYPES[0] : "image/jpeg"),
        contentLength: uploadFile.size,
        file: uploadFile,
      });

      const ticketType = mapTicketType(uploadFile);
      const next: UploadedMediaAttachment = {
        url: result.url,
        type: ticketType,
        durationSeconds,
        displayUrl: result.viewUrl ?? result.url,
        ...(mode === "bug" ? { bugType: mapBugType(uploadFile) } : {}),
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

  return { error, status, pending, processFile };
}
