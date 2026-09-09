/**
 * Named class groups for App Router error boundaries (Rule 5).
 */
export const errorBoundaryStyles = {
  root: "flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8",
  heading: "text-[1.375rem] font-semibold text-ink",
  body: "max-w-md text-center text-body text-ink-muted",
  actions: "flex gap-2",
  screenCenter: "flex min-h-screen items-center justify-center bg-paper p-8",
  screenCenterCol:
    "flex min-h-screen flex-col items-center justify-center gap-4 bg-paper p-8",
} as const;
