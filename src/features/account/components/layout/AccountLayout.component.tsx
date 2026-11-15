"use client";

import { motion } from "motion/react";
import { Button } from "@/shared/components/ui/button";
import { TextEyebrow } from "@/shared/components/display/TextEyebrow.component";
import { LABELS } from "@/shared/constants/labels";
import type {
  AccountNavItem,
  AccountSectionId,
} from "../../types/layout/types";
import { useAccountLayout } from "../../hooks/layout/useAccountLayout.hook";
import { AccountMobileNav } from "./AccountMobileNav.component";
import { AccountDesktopNav } from "./AccountDesktopNav.component";
import { accountLayoutStyles as styles } from "../../styles/layout/accountLayout.styles";

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

        {isWorkspace ? (
          <nav
            aria-label="Account sections"
            className={styles.workspaceNavContainer}
          >
            <ul className={styles.workspaceNavList}>
              {sections.map((section) => {
                const selected = section.id === activeSection;
                const Icon = section.icon;
                return (
                  <li key={section.id}>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onSectionChange(section.id)}
                      aria-current={selected ? "page" : undefined}
                      className={styles.mobileNavButton(selected)}
                    >
                      <Icon size={15} strokeWidth={1.5} aria-hidden />
                      {section.label}
                    </Button>
                  </li>
                );
              })}
            </ul>
          </nav>
        ) : (
          <AccountMobileNav
            sections={sections}
            activeSection={activeSection}
            onSectionChange={onSectionChange}
          />
        )}

        <div className={styles.layoutGrid(isWorkspace)}>
          {!isWorkspace && (
            <AccountDesktopNav
              sections={sections}
              activeSection={activeSection}
              onSectionChange={onSectionChange}
            />
          )}

          <div className={styles.mainColumn}>
            <div
              className={
                isWorkspace
                  ? styles.workspaceActiveHeader
                  : styles.mobileActiveHeader
              }
            >
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
