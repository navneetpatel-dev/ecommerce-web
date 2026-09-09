"use client";

import dynamic from "next/dynamic";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { LABELS } from "@/shared/constants/labels";
import { QueryErrorAlert } from "@/shared/components/QueryErrorAlert.component";
import type { AccountSectionId } from "../../../types/layout/types";
import { GlanceList } from "./GlanceList.component";
import { ProfileCard } from "./ProfileCard.component";
import { OverviewSectionLoadingSkeleton } from "./OverviewSectionLoadingSkeleton.component";
import { useOverviewSection } from "../../../hooks/overview/useOverviewSection.hook";
import { overviewSectionStyles as styles } from "../../../styles/overview/overviewSection.styles";

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
    memberSince,
    avatarSrc,
    uploadPending,
    uploadError,
    localError,
    fileRef,
    onPickFile,
    showCropDialog,
    cropSrc,
    avatarSpec,
    cropFilename,
    cropMimeType,
    handleCropOpenChange,
    onAvatarCropped,
    glanceItems,
  } = useOverviewSection({ onNavigate });

  if (isLoadingProfile) {
    return <OverviewSectionLoadingSkeleton />;
  }

  if (profileError || !profile) {
    return (
      <div className={styles.errorContainer}>
        <QueryErrorAlert
          error={profileError}
          fallback={LABELS.couldNotLoadProfile}
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>
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

      {showCropDialog && cropSrc && avatarSpec && (
        <ImageCropDialog
          open
          imageSrc={cropSrc}
          aspectRatio={avatarSpec.aspectRatio}
          outputWidth={avatarSpec.outputWidth}
          outputHeight={avatarSpec.outputHeight}
          sourceFilename={cropFilename}
          mimeType={cropMimeType}
          onOpenChange={handleCropOpenChange}
          onConfirm={onAvatarCropped}
        />
      )}

      <section className={styles.cardSection}>
        <div className={styles.cardHeader}>
          <TextEyebrow>At a glance</TextEyebrow>
          <p className={styles.cardSubtitle}>Jump into what matters most.</p>
        </div>
        <GlanceList items={glanceItems} />
      </section>
    </div>
  );
}
