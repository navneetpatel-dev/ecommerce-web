"use client";

import { Bike, Mail, UserRound } from "lucide-react";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { LABELS } from "@/shared/constants/labels";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import { isDeliveryRole } from "@/shared/utils/roles/roles";
import { useDeliveryProfile } from "@/features/delivery-dashboard";
import type { AccountProfile } from "../../../types/layout/types";
import { EmailVerificationStatus } from "../EmailVerificationStatus.component";
import { personalInfoSectionStyles as styles } from "../../../styles/personal-info/personalInfoSection.styles";

interface ProfileAsideProps {
  profile: Pick<AccountProfile, "name" | "phone" | "email" | "emailVerified">;
  isWorkspace: boolean;
}

function DeliveryProfileAsideDetail() {
  const profile = useDeliveryProfile();
  const agent = profile.data;
  if (!agent) return null;
  const dutyStatusLabel = agent.availableForAssignment
    ? "Available for duty"
    : "Off duty";

  return (
    <div className={styles.deliveryDetailRow}>
      <span className={styles.asideIconBoxBrand}>
        <Bike size={18} strokeWidth={1.5} />
      </span>
      <div className={styles.asideDetails}>
        <p className={styles.asideLabel}>Operating Unit</p>
        <p className={styles.asideValue}>
          {agent.vehicleType} · {agent.hubOrZone}
        </p>
        <p className={styles.asideTextMuted}>{dutyStatusLabel}</p>
      </div>
    </div>
  );
}

export function ProfileAside({ profile, isWorkspace }: ProfileAsideProps) {
  const role = useAuthStore((s) => s.currentUser?.role);
  const isDelivery = isDeliveryRole(role);
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

        {isDelivery && <DeliveryProfileAsideDetail />}

        <div className={styles.asideFooter}>
          <p className={styles.asideFooterText}>{emailFixedHint}</p>
        </div>
      </div>
    </aside>
  );
}
