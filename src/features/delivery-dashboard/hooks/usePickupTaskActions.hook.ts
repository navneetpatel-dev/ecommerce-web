"use client";

import { useState } from "react";
import {
  useConfirmPickup,
  useRequestPickupCode,
  useUpdatePickupStatus,
} from "../api/deliveryAgent.queries";
import { usePresignUpload } from "@/shared/hooks/useUploads.hook";
import { UPLOAD_ENTITY, UPLOAD_PURPOSE } from "@/shared/constants/uploads";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import { isOffline } from "../offline/deliveryOfflineQueue";

/**
 * Owns all mutable state and mutation orchestration for a pickup task
 * detail page: doorstep pickup confirmation (with item-condition/replacement
 * photo uploads and offline guard) and failed-attempt recording.
 */
export function usePickupTaskActions(returnId: string) {
  const confirm = useConfirmPickup();
  const failed = useUpdatePickupStatus();
  const requestCode = useRequestPickupCode();
  const upload = usePresignUpload();

  const [otpCode, setOtpCode] = useState("");
  const [conditionFiles, setConditionFiles] = useState<File[]>([]);
  const [replacementFile, setReplacementFile] = useState<File | null>(null);
  const [failureNote, setFailureNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File) =>
    (
      await upload.mutateAsync({
        entityType: UPLOAD_ENTITY.RETURNS,
        entityId: returnId,
        purpose: UPLOAD_PURPOSE.PHOTOS,
        filename: file.name,
        contentType: file.type,
        contentLength: file.size,
        file,
      })
    ).url;

  const complete = async () => {
    setError(null);
    if (isOffline()) {
      setError(
        "Doorstep pickup confirmation requires active internet connectivity to verify the customer passcode.",
      );
      return false;
    }
    try {
      const itemConditionPhotoUrls = await Promise.all(
        conditionFiles.map(uploadFile),
      );
      const replacementProofUrl = replacementFile
        ? await uploadFile(replacementFile)
        : undefined;
      await confirm.mutateAsync({
        returnId,
        otpCode,
        itemConditionPhotoUrls,
        replacementProofUrl,
      });
      return true;
    } catch (completeError) {
      setError(getApiErrorMessage(completeError, "Could not confirm pickup."));
      return false;
    }
  };

  const recordFailure = async () => {
    try {
      await failed.mutateAsync({ returnId, note: failureNote.trim() });
      setFailureNote("");
    } catch (failureError) {
      setError(
        getApiErrorMessage(failureError, "Could not record the failed pickup."),
      );
    }
  };

  return {
    otpCode,
    setOtpCode,
    conditionFiles,
    setConditionFiles,
    replacementFile,
    setReplacementFile,
    failureNote,
    setFailureNote,
    error,
    confirm,
    failed,
    requestCode,
    upload,
    complete,
    recordFailure,
  };
}
