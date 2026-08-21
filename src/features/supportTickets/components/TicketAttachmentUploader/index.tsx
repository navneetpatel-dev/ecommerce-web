"use client";

import { useId, useRef } from "react";
import { FormError } from "@/shared/components/FormError";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import {
  getAcceptForUpload,
  getImageUploadHintKey,
} from "@/shared/constants/imageSpecs";
import { UPLOAD_ENTITY, UPLOAD_PURPOSE } from "@/shared/constants/uploads";
import { formatLabel } from "@/shared/utils/formatLabel";
import {
  BUG_MAX_RECORDING_SECONDS,
  BUG_MAX_RECORDINGS,
  BUG_MAX_SCREENSHOTS,
  TICKET_MAX_IMAGES,
  TICKET_MAX_VIDEO_SECONDS,
  TICKET_MAX_VIDEOS,
} from "@/shared/constants/mediaLimits";
import { AttachmentList } from "./AttachmentList";
import { isVideoAttachment } from "./utils";
import { useFileProcessor } from "./useFileProcessor";
import type { Props } from "./types";

export type { UploadedMediaAttachment } from "./types";

export function TicketAttachmentUploader({
  mode = "ticket",
  entityType = mode === "bug"
    ? UPLOAD_ENTITY.BUG_REPORTS
    : UPLOAD_ENTITY.TICKETS,
  entityId,
  value,
  onChange,
  disabled,
  label,
  existingImageCount = 0,
  existingVideoCount = 0,
}: Props) {
  const inputId = useId();
  const fileRef = useRef<HTMLInputElement>(null);

  const purpose = UPLOAD_PURPOSE.ATTACHMENTS;
  const accept = getAcceptForUpload(entityType, purpose);
  const hintKey = getImageUploadHintKey(entityType, purpose);
  const hintText = hintKey ? formatLabel(LABELS[hintKey], { mb: "5" }) : null;

  const maxImages = mode === "bug" ? BUG_MAX_SCREENSHOTS : TICKET_MAX_IMAGES;
  const maxVideos = mode === "bug" ? BUG_MAX_RECORDINGS : TICKET_MAX_VIDEOS;
  const maxVideoSeconds =
    mode === "bug" ? BUG_MAX_RECORDING_SECONDS : TICKET_MAX_VIDEO_SECONDS;

  const imageCount =
    existingImageCount + value.filter((a) => !isVideoAttachment(a)).length;
  const videoCount =
    existingVideoCount + value.filter((a) => isVideoAttachment(a)).length;

  const { error, status, pending, processFile } = useFileProcessor({
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
  });

  const onPick = (list: FileList | null) => {
    if (!list?.length) return;
    void processFile(list[0]!);
  };

  const removeAt = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      {label ? (
        <p className="text-[0.8125rem] font-medium text-ink">{label}</p>
      ) : null}
      {hintText ? (
        <p className="text-[0.8125rem] leading-snug text-ink-muted">
          {hintText}
        </p>
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
      {status ? (
        <p className="text-[0.8125rem] text-ink-muted">{status}</p>
      ) : null}
      <AttachmentList items={value} onRemove={removeAt} />
      <FormError
        error={error ? new Error(error) : null}
        fallback={LABELS.uploadFailed}
      />
    </div>
  );
}

/** Alias for bug reports with SCREENSHOT / SCREEN_RECORDING mapping. */
export function BugAttachmentUploader(
  props: Omit<Props, "mode" | "entityType">,
) {
  return (
    <TicketAttachmentUploader
      {...props}
      mode="bug"
      entityType={UPLOAD_ENTITY.BUG_REPORTS}
    />
  );
}
