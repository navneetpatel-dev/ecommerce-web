/**
 * Named class groups for the header theme toggle (Rule 5).
 */
export const themeToggleButtonStyles = {
  // Icon-only where the desktop nav and search share the bar (xl), so search
  // keeps a usable width; the word comes back once there is room (2xl).
  base: "w-11 shrink-0 gap-1.5 font-mono text-[0.6875rem] font-medium uppercase tracking-wide sm:w-auto xl:w-11 xl:px-0 2xl:w-auto 2xl:px-5",
  opaque: "text-ink-muted",
  label: "hidden sm:inline xl:hidden 2xl:inline",
} as const;
