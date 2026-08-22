/**
 * Named class groups for App Router error boundaries (Rule 5).
 */
export const errorBoundaryStyles = {
  root: "flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8",
  heading: "text-[1.375rem] font-semibold text-ink",
  body: "max-w-md text-center text-[0.9375rem] text-ink-muted",
  actions: "flex gap-2",
} as const;
