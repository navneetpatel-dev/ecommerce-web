"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { LABELS } from "@/shared/constants/labels";
import { privacySectionStyles as styles } from "../../../styles/privacy/privacySection.styles";

interface DangerZoneSectionProps {
  isWorkspace: boolean;
  onDeleteClick: () => void;
}

export function DangerZoneSection({
  isWorkspace,
  onDeleteClick,
}: DangerZoneSectionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.dangerHeader}>
        <TextEyebrow>{LABELS.dangerZone}</TextEyebrow>
        <h2 className={styles.title}>{LABELS.deleteAccount}</h2>
        <p className={styles.subtitle}>
          {isWorkspace
            ? LABELS.deleteAccountHintWorkspace
            : LABELS.deleteAccountHintCustomer}
        </p>
      </div>

      <div className={styles.row}>
        <p className={styles.dangerBody}>{LABELS.deleteAccountBody}</p>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          className={styles.actionButton}
          onClick={onDeleteClick}
        >
          <Trash2 size={14} strokeWidth={1.5} />
          {LABELS.deleteAccount}
        </Button>
      </div>
    </section>
  );
}
