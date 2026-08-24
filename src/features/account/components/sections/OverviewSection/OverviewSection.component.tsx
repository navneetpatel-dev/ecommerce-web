"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Heart, LifeBuoy, Package } from "lucide-react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { PATHS } from "@/shared/constants/paths";
import { LABELS } from "@/shared/constants/labels";
import type { ImageMimeType } from "@/shared/constants/imageSpecs";
import { getImageUploadSpec } from "@/shared/constants/imageSpecs";
import { UPLOAD_ENTITY, UPLOAD_PURPOSE } from "@/shared/constants/uploads";
import { formatLabel } from "@/shared/utils/formatLabel";
import { normalizeImageMimeType } from "@/shared/utils/imageProcessing";
import { formatOrderDate } from "@/shared/utils/orderFormat";
import { readFileAsDataUrl } from "@/shared/hooks/useUploads.hook";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import { useAccountOverview } from "../../../hooks/useAccountOverview.hook";
import { useUploadAvatar } from "../../../api/account.queries";
import type { AccountSectionId } from "../../../types";
import { GlanceRow } from "./GlanceRow.component";
import { ProfileCard } from "./ProfileCard.component";

/** Rendered only while a crop is active (overlay/dialog), so no skeleton fallback is needed. */
const ImageCropDialog = dynamic(
  () =>
    import("@/shared/components/ImageCropDialog").then(
      (mod) => mod.ImageCropDialog,
    ),
  { loading: () => null },
);

interface OverviewSectionProps {
  onNavigate: (id: AccountSectionId) => void;
}

export function OverviewSection({ onNavigate }: OverviewSectionProps) {
  const {
    profile,
    isLoadingProfile,
    profileError,
    ordersCount,
    wishlistCount,
    isLoadingStats,
  } = useAccountOverview();
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

  if (isLoadingProfile) {
    return (
      <div className="space-y-4 border border-line bg-surface p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-56" />
          </div>
        </div>
      </div>
    );
  }

  if (profileError || !profile) {
    return (
      <div className="border border-line bg-surface px-5 py-10 text-center">
        <p className="text-body text-ink-muted">
          {profileError?.message ||
            "Could not load your profile. Please try again."}
        </p>
      </div>
    );
  }

  const memberSince = profile.createdAt
    ? formatOrderDate(profile.createdAt)
    : null;
  const avatarSrc = profile.avatarUrl || undefined;

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
      await uploadAvatar.mutateAsync({
        userId: profile.id,
        dataUrl,
        filename: file.name,
      });
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

  return (
    <div className="space-y-8">
      <ProfileCard
        profile={profile}
        memberSince={memberSince}
        avatarSrc={avatarSrc}
        uploadPending={uploadAvatar.isPending}
        uploadError={uploadAvatar.error as Error | null}
        localError={localError}
        fileInputRef={fileRef}
        onFileSelected={onPickFile}
      />

      {avatarSpec && cropSrc ? (
        <ImageCropDialog
          open
          imageSrc={cropSrc}
          aspectRatio={avatarSpec.aspectRatio}
          outputWidth={avatarSpec.outputWidth}
          outputHeight={avatarSpec.outputHeight}
          sourceFilename={cropFilename}
          mimeType={cropMimeType}
          onOpenChange={(open) => {
            if (!open) onAvatarCropCancelled();
          }}
          onConfirm={onAvatarCropped}
        />
      ) : null}

      <section className="border border-line bg-surface shadow-elevation-1">
        <div className="border-b border-line px-5 py-4 md:px-6">
          <TextEyebrow>At a glance</TextEyebrow>
          <p className="mt-1 text-[0.875rem] text-ink-muted">
            Jump into what matters most.
          </p>
        </div>
        <ul className="divide-y divide-line">
          <GlanceRow
            icon={Package}
            label="Orders"
            value={isLoadingStats ? "—" : String(ordersCount)}
            onDetails={() => onNavigate("orders")}
          />
          <GlanceRow
            icon={Heart}
            label="Wishlist"
            value={isLoadingStats ? "—" : String(wishlistCount)}
            href={PATHS.wishlist}
          />
          <GlanceRow
            icon={LifeBuoy}
            label={LABELS.overviewSupportTickets}
            value={LABELS.view}
            href={PATHS.supportTickets}
          />
          <GlanceRow
            icon={LifeBuoy}
            label={LABELS.overviewBugReports}
            value={LABELS.reportABug}
            href={PATHS.bugReports}
          />
        </ul>
      </section>
    </div>
  );
}
