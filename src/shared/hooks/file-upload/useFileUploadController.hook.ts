"use client";

import { useRef, useState } from "react";
import { LABELS } from "@/shared/constants/labels";
import {
  getAcceptForUpload,
  getImageUploadHintKey,
  getImageUploadSpec,
  maxBytesForUpload,
} from "@/shared/constants/imageSpecs";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import type {
  FileUploadProps,
  MultiProps,
  PreviewEntry,
  SingleProps,
} from "../../types/file-upload/types";
import { mbLabel } from "../../utils/file-upload/utils";
import {
  partitionForCrop,
  uploadLimitMessage,
  validateUploadFile,
} from "../../utils/file-upload/validateUpload";
import { useFileUploads } from "./useFileUploads.hook";
import { useFileCropSession } from "./useFileCropSession.hook";
import { buildPreviewEntries } from "./useFilePreviews.hook";

export function useFileUploadController(props: FileUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [previews, setPreviews] = useState<PreviewEntry[]>([]);

  const isMultiple = props.mode === "multiple";
  const attachedUrls = isMultiple
    ? ((props as MultiProps).valueUrls ?? [])
    : [];
  const maxFiles = isMultiple ? (props as MultiProps).maxFiles : undefined;
  const remainingSlots =
    maxFiles === undefined
      ? Number.POSITIVE_INFINITY
      : Math.max(0, maxFiles - attachedUrls.length);
  const limitReached = remainingSlots === 0;
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

  const uploadAll = async (files: File[]) => {
    if (isMultiple) await uploads.uploadMultipleFiles(files);
    else await uploads.uploadSingleFile(files[0]!);
  };
  const uploadForCrop = (file: File) => uploadAll([file]);

  const crop = useFileCropSession({ upload: uploadForCrop, onError: setError });

  const processFiles = async (files: File[]) => {
    setError(null);

    if (maxFiles !== undefined && files.length > remainingSlots) {
      setError(uploadLimitMessage(maxFiles, remainingSlots));
      if (fileRef.current) fileRef.current.value = "";
      return;
    }

    for (const file of files) {
      const validationError = validateUploadFile(file, {
        entityType: props.entityType,
        purpose: props.purpose,
        maxBytes,
        spec,
      });
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    const { directUpload, cropCandidates } = partitionForCrop(
      files,
      Boolean(spec?.cropRequired),
    );

    try {
      if (directUpload.length) await uploadAll(directUpload);

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

  const removeUrl = (url: string) => {
    setError(null);
    setPreviews((current) =>
      current.filter((entry) => entry.storedUrl !== url),
    );
    if (isMultiple) {
      (props as MultiProps).onUploaded(attachedUrls.filter((u) => u !== url));
    } else {
      (props as SingleProps).onUploaded("");
    }
  };

  return {
    accept,
    cropSession: crop.cropSession,
    error,
    fileRef,
    hintText,
    isMultiple,
    attachedCount: attachedUrls.length,
    maxFiles,
    limitReached,
    removeUrl,
    onCropCancelled: crop.onCropCancelled,
    onCropConfirmed: crop.onCropConfirmed,
    onPick,
    pending,
    previewEntries,
    spec,
  };
}
