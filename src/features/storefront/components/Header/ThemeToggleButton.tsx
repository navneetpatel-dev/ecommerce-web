"use client";

import { Moon, Sun } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { useTheme } from "@/shared/hooks/use-theme";

export function ThemeToggleButton({
  isTransparent,
}: {
  isTransparent: boolean;
}) {
  const { theme, toggleTheme, mounted } = useTheme();

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className={cn(
        "w-11 shrink-0 gap-1.5 font-mono text-[0.6875rem] font-medium uppercase tracking-wide sm:w-auto",
        "max-sm:h-9 max-sm:w-9 max-sm:min-h-9 max-sm:max-h-9 max-sm:px-0",
        isTransparent
          ? "border-paper/30 bg-transparent text-paper hover:bg-paper/10 hover:text-paper"
          : "text-ink-muted",
      )}
      aria-label={
        mounted && theme === "dark" ? LABELS.themeLight : LABELS.themeDark
      }
      title={mounted && theme === "dark" ? LABELS.themeLight : LABELS.themeDark}
    >
      {mounted && theme === "dark" ? (
        <Sun size={14} strokeWidth={1.75} aria-hidden />
      ) : (
        <Moon size={14} strokeWidth={1.75} aria-hidden />
      )}
      <span className="hidden sm:inline">
        {mounted && theme === "dark" ? LABELS.themeLight : LABELS.themeDark}
      </span>
    </Button>
  );
}
