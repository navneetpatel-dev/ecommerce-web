"use client";

import { useRef, useState } from "react";
import { LABELS } from "@/shared/constants/labels";
import type { ImageMimeType } from "@/shared/constants/imageSpecs";
import { getImageUploadSpec } from "@/shared/constants/imageSpecs";
import { UPLOAD_ENTITY, UPLOAD_PURPOSE } from "@/shared/constants/uploads/uploads";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { normalizeImageMimeType } from "@/shared/utils/media/imageProcessing";
import { readFileAsDataUrl } from "@/shared/hooks/uploads/useUploads.hook";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { useUploadAvatar } from "../../api/addresses/account.queries";

export function useAvatarUpload(userId: string) {
  const uploadAvatar = useUploadAvatar();
  const fileRef = useRef<HTMLInputElement>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [cropFilename, setCropFilename] = useState("avatar.jpg");
  const [cropMimeType, setCropMimeType] = useState<ImageMimeType>("image/jpeg");
  const avatarSpec = getImageUploadSpec(
    UPLOAD_ENTITY.USERS,
    UPLOAD_PURPOSE.AVATAR,
  );

  const onPickFile = (file: File | null) => {
    if (!file || !avatarSpec) return;
    if (!file.type.startsWith("image/")) {
      setLocalError(LABELS.uploadInvalidImageType);
      return;
    }
    if (file.size > avatarSpec.maxBytes) {
      setLocalError(formatLabel(LABELS.uploadTooLargeMb, { mb: "1.5" }));
      return;
    }
    setLocalError(null);
    setCropFilename(file.name);
    setCropMimeType(normalizeImageMimeType(file));
    setCropSrc(URL.createObjectURL(file));
    if (fileRef.current) fileRef.current.value = "";
  };

  const onAvatarCropped = async (file: File) => {
    setLocalError(null);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      await uploadAvatar.mutateAsync({ userId, dataUrl, filename: file.name });
    } catch (err) {
      setLocalError(getApiErrorMessage(err, LABELS.uploadFailed));
    } finally {
      if (cropSrc) URL.revokeObjectURL(cropSrc);
      setCropSrc(null);
    }
  };

  const onAvatarCropCancelled = () => {
    if (cropSrc) URL.revokeObjectURL(cropSrc);
    setCropSrc(null);
  };

  return {
    fileRef,
    localError,
    cropSrc,
    cropFilename,
    cropMimeType,
    avatarSpec,
    uploadPending: uploadAvatar.isPending,
    uploadError: uploadAvatar.error as Error | null,
    onPickFile,
    onAvatarCropped,
    onAvatarCropCancelled,
  };
}
