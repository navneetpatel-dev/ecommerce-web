export const notFoundStyles = {
  container:
    "flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center gap-6 bg-paper p-8 lg:min-h-[calc(100vh-72px)]",
  icon: "text-ink-faint",
  heading: "font-display text-ink",
  body: "max-w-sm text-center text-body text-ink-muted",
  workspaceContainer:
    "flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8",
  workspaceHeading: "text-[1.375rem] font-semibold text-ink",
  workspaceBody: "max-w-md text-center text-body text-ink-muted",
} as const;
