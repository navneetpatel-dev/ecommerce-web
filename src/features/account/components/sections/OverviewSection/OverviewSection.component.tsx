"use client";

import dynamic from "next/dynamic";
import { Heart, LifeBuoy, Package } from "lucide-react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { PATHS } from "@/shared/constants/paths";
import { LABELS } from "@/shared/constants/labels";
import { formatOrderDate } from "@/shared/utils/orderFormat";
import { QueryErrorAlert } from "@/shared/components/QueryErrorAlert.component";
import { useAccountOverview } from "../../../hooks/useAccountOverview.hook";
import { useAvatarUpload } from "../../../hooks/useAvatarUpload.hook";
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
  const {
    fileRef,
    localError,
    cropSrc,
    cropFilename,
    cropMimeType,
    avatarSpec,
    uploadPending,
    uploadError,
    onPickFile,
    onAvatarCropped,
    onAvatarCropCancelled,
  } = useAvatarUpload(profile?.id ?? "");

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
        <QueryErrorAlert
          error={profileError}
          fallback={LABELS.couldNotLoadProfile}
        />
      </div>
    );
  }

  const memberSince = profile.createdAt
    ? formatOrderDate(profile.createdAt)
    : null;
  const avatarSrc = profile.avatarUrl || undefined;

  return (
    <div className="space-y-8">
      <ProfileCard
        profile={profile}
        memberSince={memberSince}
        avatarSrc={avatarSrc}
        uploadPending={uploadPending}
        uploadError={uploadError}
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
