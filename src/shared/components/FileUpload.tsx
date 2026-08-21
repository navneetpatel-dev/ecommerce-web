"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { FormError } from "@/shared/components/FormError";
import { MediaImage } from "@/shared/components/MediaImage";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import {
  getAcceptForUpload,
  getImageUploadHintKey,
  getImageUploadSpec,
  isAllowedUploadMime,
  isVideoMimeType,
  maxBytesForUpload,
  type ImageMimeType,
} from "@/shared/constants/imageSpecs";
import {
  usePresignUpload,
  usePresignUploadBulk,
} from "@/shared/hooks/useUploads";
import type {
  UploadEntityType,
  UploadPurpose,
} from "@/shared/constants/uploads";
import { formatLabel } from "@/shared/utils/formatLabel";
import {
  getApiErrorMessage,
  sanitizeUserFacingMessage,
} from "@/shared/utils/apiErrorMessage";
import { normalizeImageMimeType } from "@/shared/utils/imageProcessing";

/** Rendered only while a crop session is active (overlay/dialog), so no skeleton fallback is needed. */
const ImageCropDialog = dynamic(
  () =>
    import("@/shared/components/ImageCropDialog").then(
      (mod) => mod.ImageCropDialog,
    ),
  { loading: () => null },
);

type PreviewEntry = { storedUrl: string; displayUrl: string };

type SingleProps = {
  mode?: "single";
  entityType: UploadEntityType;
  entityId: string;
  purpose: UploadPurpose;
  accept?: string;
  maxBytes?: number;
  disabled?: boolean;
  valueUrl?: string | null;
  onUploaded: (url: string) => void;
  label?: string;
};

type MultiProps = {
  mode: "multiple";
  entityType: UploadEntityType;
  entityId: string;
  purpose: UploadPurpose;
  accept?: string;
  maxBytes?: number;
  disabled?: boolean;
  valueUrls?: string[];
  onUploaded: (urls: string[]) => void;
  label?: string;
};

export type FileUploadProps = SingleProps | MultiProps;

type CropSession = {
  objectUrl: string;
  filename: string;
  mimeType: ImageMimeType;
  /** Files still waiting for crop after the current one. */
  pending: Array<{
    objectUrl: string;
    filename: string;
    mimeType: ImageMimeType;
  }>;
};

function isPdfUrl(url: string): boolean {
  return /\.pdf($|\?)/i.test(url);
}

function isVideoUrl(url: string): boolean {
  return /\.(mp4|webm)($|\?)/i.test(url);
}

function isPdfFile(file: File): boolean {
  return file.type === "application/pdf" || /\.pdf$/i.test(file.name);
}

function isVideoFile(file: File): boolean {
  return isVideoMimeType(file.type) || /\.(mp4|webm)$/i.test(file.name);
}

function mbLabel(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  return mb % 1 === 0 ? String(mb) : mb.toFixed(1);
}

/**
 * Phase-1 uploader — crop/resize when required, pre-signed PUT to S3, returns URL(s) for Phase-2 attach.
 */
export function FileUpload(props: FileUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [previews, setPreviews] = useState<PreviewEntry[]>([]);
  const [cropSession, setCropSession] = useState<CropSession | null>(null);
  const presignOne = usePresignUpload();
  const presignBulk = usePresignUploadBulk();

  const isMultiple = props.mode === "multiple";
  const pending = presignOne.isPending || presignBulk.isPending;
  const spec = getImageUploadSpec(props.entityType, props.purpose);
  const maxBytes =
    props.maxBytes ?? maxBytesForUpload(props.entityType, props.purpose);
  const accept =
    props.accept ?? getAcceptForUpload(props.entityType, props.purpose);
  const hintKey = getImageUploadHintKey(props.entityType, props.purpose);
  const hintText = hintKey
    ? formatLabel(LABELS[hintKey], { mb: mbLabel(maxBytes) })
    : null;

  const validateFile = (file: File): string | null => {
    if (file.size > maxBytes) {
      return formatLabel(LABELS.uploadTooLargeMb, { mb: mbLabel(maxBytes) });
    }
    const mime = file.type.toLowerCase();
    if (!isAllowedUploadMime(props.entityType, props.purpose, mime)) {
      if (spec?.mimeTypes.every((type) => type.startsWith("video/"))) {
        return LABELS.imageUploadInvalidVideoType;
      }
      return spec?.mimeTypes.includes("application/pdf")
        ? LABELS.imageUploadInvalidDocumentType
        : LABELS.uploadInvalidImageType;
    }
    return null;
  };

  const uploadSingleFile = async (file: File) => {
    const contentType = file.type || "application/octet-stream";
    const result = await presignOne.mutateAsync({
      entityType: props.entityType,
      entityId: props.entityId,
      purpose: props.purpose,
      filename: file.name,
      contentType,
      contentLength: file.size,
      file,
    });
    setPreviews([
      { storedUrl: result.url, displayUrl: result.viewUrl ?? result.url },
    ]);
    if (!isMultiple) {
      (props as SingleProps).onUploaded(result.url);
    }
    return result;
  };

  const uploadMultipleFiles = async (files: File[]) => {
    const result = await presignBulk.mutateAsync({
      entityType: props.entityType,
      entityId: props.entityId,
      purpose: props.purpose,
      files: files.map((file) => ({
        filename: file.name,
        contentType: file.type || "application/octet-stream",
        contentLength: file.size,
      })),
      fileObjects: files,
    });

    if (result.errors.length) {
      setError(
        result.errors
          .map((e) =>
            formatLabel(LABELS.uploadFileFailedAt, {
              index: String(e.index + 1),
              message: sanitizeUserFacingMessage(
                e.message,
                LABELS.uploadFailed,
              ),
            }),
          )
          .join(" "),
      );
    }

    if (result.items.length) {
      const newEntries = result.items.map((item) => ({
        storedUrl: item.url,
        displayUrl: item.viewUrl ?? item.url,
      }));
      setPreviews((prev) => [...prev, ...newEntries]);
      (props as MultiProps).onUploaded([
        ...((props as MultiProps).valueUrls ?? []),
        ...result.items.map((item) => item.url),
      ]);
    }
  };

  const onCropConfirmed = async (file: File) => {
    const current = cropSession;
    if (!current) return;

    try {
      if (isMultiple) {
        await uploadMultipleFiles([file]);
      } else {
        await uploadSingleFile(file);
      }
    } catch (err) {
      setError(getApiErrorMessage(err, LABELS.uploadFailed));
    }

    URL.revokeObjectURL(current.objectUrl);

    if (!current.pending.length) {
      setCropSession(null);
      return;
    }

    const [next, ...rest] = current.pending;
    setCropSession({
      objectUrl: next!.objectUrl,
      filename: next!.filename,
      mimeType: next!.mimeType,
      pending: rest,
    });
  };

  const onCropCancelled = () => {
    if (!cropSession) return;
    URL.revokeObjectURL(cropSession.objectUrl);
    cropSession.pending.forEach((item) => URL.revokeObjectURL(item.objectUrl));
    setCropSession(null);
  };

  const processFiles = async (files: File[]) => {
    setError(null);

    for (const file of files) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    const directUpload: File[] = [];
    const cropCandidates: File[] = [];

    for (const file of files) {
      const needsCrop =
        spec?.cropRequired && !isPdfFile(file) && !isVideoFile(file);
      if (needsCrop) {
        cropCandidates.push(file);
      } else {
        directUpload.push(file);
      }
    }

    try {
      if (directUpload.length) {
        if (isMultiple) {
          await uploadMultipleFiles(directUpload);
        } else {
          await uploadSingleFile(directUpload[0]!);
        }
      }

      if (cropCandidates.length) {
        const prepared = cropCandidates.map((file) => ({
          objectUrl: URL.createObjectURL(file),
          filename: file.name,
          mimeType: normalizeImageMimeType(file),
        }));
        const [first, ...rest] = prepared;
        setCropSession({
          objectUrl: first!.objectUrl,
          filename: first!.filename,
          mimeType: first!.mimeType,
          pending: rest,
        });
      }
    } catch (err) {
      setError(getApiErrorMessage(err, LABELS.uploadFailed));
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const onPick = (list: FileList | null) => {
    if (!list?.length) return;
    void processFiles(Array.from(list));
  };

  const previewEntries: PreviewEntry[] = isMultiple
    ? [
        ...((props as MultiProps).valueUrls ?? []).map((storedUrl) => {
          const known = previews.find((p) => p.storedUrl === storedUrl);
          return known ?? { storedUrl, displayUrl: storedUrl };
        }),
        ...previews.filter(
          (p) => !((props as MultiProps).valueUrls ?? []).includes(p.storedUrl),
        ),
      ]
    : (props as SingleProps).valueUrl
      ? [
          previews.find(
            (p) => p.storedUrl === (props as SingleProps).valueUrl,
          ) ?? {
            storedUrl: (props as SingleProps).valueUrl!,
            displayUrl: (props as SingleProps).valueUrl!,
          },
        ]
      : previews;

  return (
    <>
      <div className="space-y-2">
        {props.label ? (
          <p className="text-[0.8125rem] font-medium text-ink">{props.label}</p>
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
            disabled={props.disabled || pending || !props.entityId}
            onClick={() => fileRef.current?.click()}
          >
            {pending
              ? LABELS.uploading
              : isMultiple
                ? LABELS.uploadFiles
                : LABELS.uploadFile}
          </Button>
          <input
            ref={fileRef}
            type="file"
            className="sr-only"
            accept={accept}
            multiple={isMultiple}
            disabled={props.disabled || pending}
            onChange={(e) => onPick(e.target.files)}
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
                  {LABELS.pdfPreview}
                </li>
              ) : isVideoUrl(entry.displayUrl) ? (
                <li
                  key={entry.storedUrl}
                  className="relative h-16 w-24 overflow-hidden border border-line bg-paper"
                >
                  <video
                    src={entry.displayUrl}
                    className="h-full w-full object-cover"
                    muted
                    playsInline
                    aria-label={LABELS.videoPreview}
                  />
                </li>
              ) : (
                <li
                  key={entry.storedUrl}
                  className="relative h-16 w-16 overflow-hidden border border-line bg-paper"
                >
                  <MediaImage
                    src={entry.displayUrl}
                    alt=""
                    sizes="64px"
                    imageClassName="object-cover"
                  />
                </li>
              ),
            )}
          </ul>
        ) : null}
        <FormError
          error={error ? new Error(error) : null}
          fallback={LABELS.uploadFailed}
        />
      </div>

      {spec?.cropRequired && cropSession ? (
        <ImageCropDialog
          open
          imageSrc={cropSession.objectUrl}
          aspectRatio={spec.aspectRatio}
          outputWidth={spec.outputWidth}
          outputHeight={spec.outputHeight}
          sourceFilename={cropSession.filename}
          mimeType={cropSession.mimeType}
          onOpenChange={(open) => {
            if (!open) onCropCancelled();
          }}
          onConfirm={onCropConfirmed}
        />
      ) : null}
    </>
  );
}
