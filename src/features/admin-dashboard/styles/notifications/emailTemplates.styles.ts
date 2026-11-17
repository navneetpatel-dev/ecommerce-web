export const emailTemplatesStyles = {
  layout: "grid grid-cols-1 gap-5 lg:grid-cols-[22rem_minmax(0,1fr)]",
  catalogue:
    "rounded-xl border border-line bg-surface lg:max-h-[75vh] lg:overflow-y-auto",
  group: "border-b border-line last:border-b-0",
  groupHeading:
    "sticky top-0 bg-surface px-4 py-2 text-caption font-semibold uppercase tracking-wide text-brand",
  audienceTag:
    "ml-2 rounded-full bg-surface-muted px-2 py-0.5 text-[10px] font-medium normal-case tracking-normal text-ink-muted",
  item: "flex w-full flex-col items-start gap-0.5 px-4 py-2.5 text-left transition-colors hover:bg-surface-muted",
  itemActive: "bg-brand-subtle",
  itemType: "font-mono text-caption text-ink-muted",
  itemSubject: "text-body-sm text-ink",
  marketingTag: "text-caption text-accent",
  previewPanel: "rounded-xl border border-line bg-surface",
  toolbar:
    "flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3",
  toolbarTitle: "min-w-0 text-body-sm text-ink",
  toolbarSubject: "block truncate font-medium",
  toolbarActions: "flex flex-wrap items-center gap-2",
  frame: "h-[70vh] w-full rounded-b-xl bg-paper",
  empty: "px-4 py-16 text-center text-body-sm text-ink-muted",
  loading: "px-4 py-16 text-center text-body-sm text-ink-muted",
} as const;
