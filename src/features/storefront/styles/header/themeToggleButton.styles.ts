/**
 * Named class groups for the header theme toggle (Rule 5).
 */
export const themeToggleButtonStyles = {
  base: "w-11 shrink-0 gap-1.5 font-mono text-[0.6875rem] font-medium uppercase tracking-wide sm:w-auto",
  transparent:
    "border-paper/30 bg-transparent text-paper hover:bg-paper/10 hover:text-paper",
  opaque: "text-ink-muted",
  label: "hidden sm:inline",
} as const;
