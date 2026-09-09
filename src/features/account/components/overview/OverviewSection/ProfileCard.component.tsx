"use client";

import type { RefObject } from "react";
import { Camera } from "lucide-react";
import { motion } from "motion/react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { FormError } from "@/shared/components/FormError.component";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import type { AccountProfile } from "../../../types/layout/types";
import { EmailVerificationStatus } from "../../personal-info/EmailVerificationStatus.component";
import { useProfileCard } from "./useProfileCard.hook";
import { profileCardStyles as styles } from "./profileCard.styles";

interface ProfileCardProps {
  profile: Pick<
    AccountProfile,
    "name" | "email" | "emailVerified" | "avatarUrl"
  >;
  memberSince: string | null;
  avatarSrc: string | undefined;
  uploadPending: boolean;
  uploadError: Error | null;
  localError: string | null;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onFileSelected: (file: File | null) => void;
}

const MOTION_CONFIG = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.28, ease: [0.2, 0, 0, 1] },
} as const;

export function ProfileCard({
  profile,
  memberSince,
  avatarSrc,
  uploadPending,
  uploadError,
  localError,
  fileInputRef,
  onFileSelected,
}: ProfileCardProps) {
  const {
    avatarInitials,
    memberSinceLabel,
    uploadFormError,
    handleAvatarClick,
    handleFileInputChange,
  } = useProfileCard({
    profile,
    memberSince,
    uploadError,
    localError,
    fileInputRef,
    onFileSelected,
  });

  return (
    <motion.section
      initial={MOTION_CONFIG.initial}
      animate={MOTION_CONFIG.animate}
      transition={MOTION_CONFIG.transition}
      className={styles.card}
    >
      <div aria-hidden className={styles.topAccentBar} />
      <div className={styles.contentWrapper}>
        <div className={styles.avatarContainer}>
          <Button
            type="button"
            variant="ghost"
            onClick={handleAvatarClick}
            disabled={uploadPending}
            className={styles.avatarButton}
            aria-label={LABELS.uploadProfilePhoto}
          >
            <Avatar className={styles.avatar}>
              {avatarSrc && <AvatarImage src={avatarSrc} alt="" />}
              <AvatarFallback className={styles.avatarFallback}>
                {avatarInitials}
              </AvatarFallback>
            </Avatar>
            <span className={styles.cameraBadge}>
              <Camera size={14} strokeWidth={1.5} />
            </span>
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className={styles.fileInput}
            onChange={handleFileInputChange}
          />
        </div>

        <div className={styles.detailsWrapper}>
          <TextEyebrow brand>{LABELS.profile}</TextEyebrow>
          <h2 className={styles.nameHeading}>{profile.name}</h2>
          <div className={styles.emailRow}>
            <p className={styles.emailText}>{profile.email}</p>
            <EmailVerificationStatus emailVerified={profile.emailVerified} />
          </div>
          {memberSinceLabel && (
            <p className={styles.memberSinceNotice}>{memberSinceLabel}</p>
          )}
          <p className={styles.uploadHint}>{LABELS.uploadProfilePhotoHint}</p>
          <FormError error={uploadFormError} fallback={LABELS.uploadFailed} />
        </div>
      </div>
    </motion.section>
  );
}
