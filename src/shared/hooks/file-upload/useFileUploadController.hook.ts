"use client";

import { useRef, useState } from "react";
import { LABELS } from "@/shared/constants/labels";
import {
  getAcceptForUpload,
  getImageUploadHintKey,
  getImageUploadSpec,
  isAllowedUploadMime,
  maxBytesForUpload,
} from "@/shared/constants/imageSpecs";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import type { FileUploadProps, PreviewEntry } from "../../types/file-upload/types";
import { isPdfFile, isVideoFile, mbLabel } from "../../utils/file-upload/utils";
import { useFileUploads } from "./useFileUploads.hook";
import { useFileCropSession } from "./useFileCropSession.hook";
import { buildPreviewEntries } from "./useFilePreviews.hook";

export function useFileUploadController(props: FileUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [previews, setPreviews] = useState<PreviewEntry[]>([]);

  const isMultiple = props.mode === "multiple";
  const spec = getImageUploadSpec(props.entityType, props.purpose);
  const maxBytes =
    props.maxBytes ?? maxBytesForUpload(props.entityType, props.purpose);
  const accept =
    props.accept ?? getAcceptForUpload(props.entityType, props.purpose);
  const hintKey = getImageUploadHintKey(props.entityType, props.purpose);
  const hintText = hintKey
    ? formatLabel(LABELS[hintKey], { mb: mbLabel(maxBytes) })
    : null;

  const uploads = useFileUploads({
    props,
    isMultiple,
    setPreviews,
    onError: setError,
  });
  const { pending } = uploads;

  const uploadForCrop = async (file: File) => {
    if (isMultiple) {
      await uploads.uploadMultipleFiles([file]);
    } else {
      await uploads.uploadSingleFile(file);
    }
  };

  const crop = useFileCropSession({ upload: uploadForCrop, onError: setError });

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
          await uploads.uploadMultipleFiles(directUpload);
        } else {
          await uploads.uploadSingleFile(directUpload[0]!);
        }
      }

      if (cropCandidates.length) {
        crop.beginCropSession(cropCandidates);
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

  const previewEntries = buildPreviewEntries({ props, isMultiple, previews });

  return {
    accept,
    cropSession: crop.cropSession,
    error,
    fileRef,
    hintText,
    isMultiple,
    onCropCancelled: crop.onCropCancelled,
    onCropConfirmed: crop.onCropConfirmed,
    onPick,
    pending,
    previewEntries,
    spec,
  };
}
