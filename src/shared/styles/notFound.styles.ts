export const notFoundStyles = {
  container:
    "flex min-h-[calc(100dvh-3.5rem)] flex-col items-center justify-center gap-6 bg-paper p-8 lg:min-h-[calc(100dvh-72px)]",
  icon: "text-ink-faint",
  heading: "font-display text-ink text-display-sm",
  searchForm: "flex w-full max-w-sm gap-2",
  searchInput: "flex-1 text-[1rem] sm:text-body",
  links: "flex flex-wrap items-center justify-center gap-x-6 gap-y-2",
  link: "text-body-sm font-medium text-brand underline underline-offset-4",
  body: "max-w-sm text-center text-body text-ink-muted",
  workspaceContainer:
    "flex min-h-[60dvh] flex-col items-center justify-center gap-4 p-8",
  workspaceHeading: "text-[1.375rem] font-semibold text-ink",
  workspaceBody: "max-w-md text-center text-body text-ink-muted",
} as const;
