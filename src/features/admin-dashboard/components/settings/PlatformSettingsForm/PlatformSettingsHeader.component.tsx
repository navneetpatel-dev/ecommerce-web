"use client";

import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { platformSettingsFormStyles as styles } from "../../../styles/settings/platformSettingsForm.styles";

interface PlatformSettingsHeaderProps {
  onSave: () => void;
  saving?: boolean;
}

export function PlatformSettingsHeader({
  onSave,
  saving = false,
}: PlatformSettingsHeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.headerTextGroup}>
        <h2 className={styles.headerTitle}>{LABELS.platformSettings}</h2>
        <p className={styles.headerSubtitle}>{LABELS.platformSettingsHint}</p>
      </div>
      <Button
        type="button"
        className={styles.headerSaveButton}
        onClick={onSave}
        disabled={saving}
      >
        {saving ? LABELS.savingSettings : LABELS.saveSettings}
      </Button>
    </div>
  );
}
