"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { useThemePalette } from "@/shared/hooks/theme/useThemePalette.hook";
import { mobileNavDrawerStyles as styles } from "../../styles/mobile-nav/mobileNavDrawer.styles";

/** The theme switch for phones, where the header has no room for it. */
export function MobileNavThemeRow() {
  const { mode, toggleMode, mounted } = useThemePalette();
  const isDark = mounted && mode === "dark";

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={toggleMode}
      className={styles.themeRow}
    >
      {isDark ? (
        <Sun className={styles.themeIcon} aria-hidden />
      ) : (
        <Moon className={styles.themeIcon} aria-hidden />
      )}
      {isDark ? LABELS.themeSwitchToLight : LABELS.themeSwitchToDark}
    </Button>
  );
}
