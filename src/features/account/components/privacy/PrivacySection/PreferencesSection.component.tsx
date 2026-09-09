"use client";

import { Download, LogOut } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { FormError } from "@/shared/components/FormError.component";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { LABELS } from "@/shared/constants/labels";
import { privacySectionStyles as styles } from "../../../styles/privacy/privacySection.styles";

interface PreferencesSectionProps {
  theme: string;
  mounted: boolean;
  isWorkspace: boolean;
  isCustomer: boolean;
  exportPending: boolean;
  exportError: Error | null;
  onSetThemeLight: () => void;
  onSetThemeDark: () => void;
  onExport: () => void;
  onSignOutClick: () => void;
}

export function PreferencesSection({
  theme,
  mounted,
  isWorkspace,
  isCustomer,
  exportPending,
  exportError,
  onSetThemeLight,
  onSetThemeDark,
  onExport,
  onSignOutClick,
}: PreferencesSectionProps) {
  const lightVariant = mounted && theme === "light" ? "default" : "outline";
  const darkVariant = mounted && theme === "dark" ? "default" : "outline";

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <TextEyebrow>{LABELS.privacyPreferences}</TextEyebrow>
        <h2 className={styles.title}>{LABELS.privacyAndData}</h2>
        <p className={styles.subtitle}>
          {isWorkspace
            ? LABELS.privacyAndDataHintWorkspace
            : LABELS.privacyAndDataHintCustomer}
        </p>
      </div>

      <ul className={styles.list}>
        <li className={styles.row}>
          <div className={styles.rowContent}>
            <p className={styles.rowTitle}>{LABELS.appearance}</p>
            <p className={styles.rowSubtitle}>
              {isWorkspace
                ? LABELS.appearanceHintWorkspace
                : LABELS.appearanceHintCustomer}
            </p>
          </div>
          <div className={styles.themeButtonsGroup}>
            <Button
              type="button"
              variant={lightVariant}
              size="sm"
              onClick={onSetThemeLight}
            >
              {LABELS.themeLight}
            </Button>
            <Button
              type="button"
              variant={darkVariant}
              size="sm"
              onClick={onSetThemeDark}
            >
              {LABELS.themeDark}
            </Button>
          </div>
        </li>

        {isCustomer && (
          <li className={styles.row}>
            <div className={styles.rowContent}>
              <p className={styles.rowTitle}>{LABELS.downloadMyData}</p>
              <p className={styles.rowSubtitle}>
                {LABELS.downloadMyDataHintCustomer}
              </p>
              <FormError
                error={exportError}
                fallback={LABELS.couldNotExportAccount}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={styles.actionButton}
              loading={exportPending}
              onClick={onExport}
            >
              <Download size={14} strokeWidth={1.5} />
              {LABELS.download}
            </Button>
          </li>
        )}

        <li className={styles.row}>
          <div className={styles.rowContent}>
            <p className={styles.rowTitle}>{LABELS.signOut}</p>
            <p className={styles.rowSubtitle}>{LABELS.signOutHint}</p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className={styles.actionButton}
            onClick={onSignOutClick}
          >
            <LogOut size={14} strokeWidth={1.5} />
            {LABELS.signOut}
          </Button>
        </li>
      </ul>
    </section>
  );
}
