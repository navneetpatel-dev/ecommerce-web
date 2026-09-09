"use client";

import { motion } from "motion/react";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { LABELS } from "@/shared/constants/labels";
import type { AccountNavItem, AccountSectionId } from "../types";
import { useAccountLayout } from "./useAccountLayout.hook";
import { AccountMobileNav } from "./AccountMobileNav.component";
import { AccountDesktopNav } from "./AccountDesktopNav.component";
import { accountLayoutStyles as styles } from "./accountLayout.styles";

interface AccountLayoutProps {
  sections: AccountNavItem[];
  activeSection: AccountSectionId;
  onSectionChange: (id: AccountSectionId) => void;
  children: React.ReactNode;
}

const MOTION_CONFIG = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.28, ease: [0.2, 0, 0, 1] },
} as const;

export function AccountLayout({
  sections,
  activeSection,
  onSectionChange,
  children,
}: AccountLayoutProps) {
  const { isWorkspace, active, settingsHint } = useAccountLayout({
    sections,
    activeSection,
  });

  return (
    <div className={styles.root(isWorkspace)}>
      {!isWorkspace && <div aria-hidden className={styles.ambientGradient} />}

      <div className={styles.content(isWorkspace)}>
        <motion.header
          initial={MOTION_CONFIG.initial}
          animate={MOTION_CONFIG.animate}
          transition={MOTION_CONFIG.transition}
          className={styles.header(isWorkspace)}
        >
          <TextEyebrow brand>{LABELS.account}</TextEyebrow>
          <h1 className={styles.title}>{LABELS.settings}</h1>
          <p className={styles.hint}>{settingsHint}</p>
        </motion.header>

        <AccountMobileNav
          sections={sections}
          activeSection={activeSection}
          onSectionChange={onSectionChange}
        />

        <div className={styles.layoutGrid}>
          <AccountDesktopNav
            sections={sections}
            activeSection={activeSection}
            onSectionChange={onSectionChange}
          />

          <div className={styles.mainColumn}>
            <div className={styles.mobileActiveHeader}>
              <TextEyebrow>{active.label}</TextEyebrow>
              <p className={styles.mobileActiveDescription}>
                {active.description}
              </p>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
