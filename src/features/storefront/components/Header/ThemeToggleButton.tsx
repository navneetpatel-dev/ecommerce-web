"use client";

import { Moon, Sun } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { useThemePalette } from "@/shared/hooks/useThemePalette.hook";
import { themeToggleButtonStyles as styles } from "./themeToggleButton.styles";

export function ThemeToggleButton(props: { isTransparent: boolean }) {
  const { isTransparent } = props;
  const { mode, toggleMode, mounted } = useThemePalette();
  const isDark = mounted && mode === "dark";

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={toggleMode}
      className={cn(
        styles.base,
        isTransparent ? styles.transparent : styles.opaque,
      )}
      aria-label={isDark ? LABELS.themeLight : LABELS.themeDark}
      title={isDark ? LABELS.themeLight : LABELS.themeDark}
    >
      {isDark ? (
        <Sun size={14} strokeWidth={1.75} aria-hidden />
      ) : (
        <Moon size={14} strokeWidth={1.75} aria-hidden />
      )}
      <span className={styles.label}>
        {isDark ? LABELS.themeLight : LABELS.themeDark}
      </span>
    </Button>
  );
}
