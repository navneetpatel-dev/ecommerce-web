import { useMemo, type ChangeEvent, type RefObject } from "react";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import type { AccountProfile } from "../../../types/layout/types";

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
}

interface UseProfileCardParams {
  profile: Pick<
    AccountProfile,
    "name" | "email" | "emailVerified" | "avatarUrl"
  >;
  memberSince: string | null;
  uploadError: Error | null;
  localError: string | null;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onFileSelected: (file: File | null) => void;
}

export function useProfileCard({
  profile,
  memberSince,
  uploadError,
  localError,
  fileInputRef,
  onFileSelected,
}: UseProfileCardParams) {
  const avatarInitials = useMemo(
    () => getInitials(profile.name),
    [profile.name],
  );

  const memberSinceLabel = useMemo(() => {
    if (!memberSince) return null;
    return formatLabel(LABELS.memberSince, { date: memberSince });
  }, [memberSince]);

  const uploadFormError = useMemo(() => {
    if (uploadError) return uploadError;
    if (localError) return new Error(localError);
    return null;
  }, [uploadError, localError]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    onFileSelected(e.target.files?.[0] ?? null);
  };

  return {
    avatarInitials,
    memberSinceLabel,
    uploadFormError,
    handleAvatarClick,
    handleFileInputChange,
  };
}
