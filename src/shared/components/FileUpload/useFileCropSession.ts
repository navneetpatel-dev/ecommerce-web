"use client";

import { useState } from "react";
import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import { normalizeImageMimeType } from "@/shared/utils/imageProcessing";
import type { CropSession } from "./types";

export function useFileCropSession(options: {
  upload: (file: File) => Promise<void>;
  onError: (message: string) => void;
}) {
  const [cropSession, setCropSession] = useState<CropSession | null>(null);

  const beginCropSession = (files: File[]) => {
    if (!files.length) return;
    const prepared = files.map((file) => ({
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
  };

  const onCropConfirmed = async (file: File) => {
    const current = cropSession;
    if (!current) return;

    try {
      await options.upload(file);
    } catch (err) {
      options.onError(getApiErrorMessage(err, LABELS.uploadFailed));
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

  return {
    beginCropSession,
    cropSession,
    onCropCancelled,
    onCropConfirmed,
  };
}
