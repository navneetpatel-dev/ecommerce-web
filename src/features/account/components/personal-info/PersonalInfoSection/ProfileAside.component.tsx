"use client";

import { Mail, UserRound } from "lucide-react";
import { TextEyebrow } from "@/shared/components/display/TextEyebrow.component";
import { LABELS } from "@/shared/constants/labels";
import type { AccountProfile } from "../../../types/layout/types";
import { EmailVerificationStatus } from "../EmailVerificationStatus.component";
import { personalInfoSectionStyles as styles } from "../../../styles/personal-info/personalInfoSection.styles";

interface ProfileAsideProps {
  profile: Pick<AccountProfile, "name" | "phone" | "email" | "emailVerified">;
  isWorkspace: boolean;
}

export function ProfileAside({ profile, isWorkspace }: ProfileAsideProps) {
  const emailFixedHint = isWorkspace
    ? LABELS.emailFixedWorkspace
    : LABELS.emailFixedStorefront;

  return (
    <aside className={styles.aside}>
      <div className={styles.asideHeader}>
        <TextEyebrow>{LABELS.personalInfoProfileEyebrow}</TextEyebrow>
        <p className={styles.asideHint}>{LABELS.personalInfoProfileHint}</p>
      </div>

      <div className={styles.asideBody}>
        <div className={styles.asideRow}>
          <span className={styles.asideIconBox}>
            <UserRound size={18} strokeWidth={1.5} />
          </span>
          <div className={styles.asideDetails}>
            <p className={styles.asideLabel}>
              {LABELS.personalInfoAccountHolder}
            </p>
            <p className={styles.asideValue}>{profile.name}</p>
            {profile.phone ? (
              <p className={styles.asideTextMuted}>{profile.phone}</p>
            ) : (
              <p className={styles.asideTextFaint}>
                {LABELS.personalInfoNoPhone}
              </p>
            )}
          </div>
        </div>

        <div className={styles.asideRow}>
          <span className={styles.asideIconBox}>
            <Mail size={18} strokeWidth={1.5} />
          </span>
          <div className={styles.asideDetails}>
            <p className={styles.asideLabel}>
              {LABELS.personalInfoEmailStatus}
            </p>
            <p className={styles.asideValueBreak}>{profile.email}</p>
            <div className={styles.verificationWrapper}>
              <EmailVerificationStatus emailVerified={profile.emailVerified} />
            </div>
          </div>
        </div>

        <div className={styles.asideFooter}>
          <p className={styles.asideFooterText}>{emailFixedHint}</p>
        </div>
      </div>
    </aside>
  );
}
