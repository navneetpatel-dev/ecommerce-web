export const rtoHandoverCardStyles = {
  card: "border border-line bg-surface shadow-elevation-1",
  header:
    "flex items-center justify-between border-b border-line bg-paper/55 px-5 py-3.5",
  headerLeft: "flex items-center gap-2",
  icon: "size-4 text-warning",
  eyebrow: "!mb-0",
  badge: "text-caption font-medium uppercase tracking-wider text-warning",
  body: "space-y-5 p-5 md:p-6",
  title: "font-display text-[1.125rem] font-medium text-ink",
  subtitle: "mt-1 text-body-sm text-ink-muted",
  noticeText: "text-body-sm text-success",
  codeSection: "rounded-lg border border-line bg-paper/40 p-4 space-y-3",
  codeHeader: "flex flex-wrap items-center justify-between gap-2",
  label: "text-body-sm font-medium text-ink",
  inputRow: "flex items-center gap-3",
  input:
    "max-w-[180px] text-center font-mono text-xl tracking-[0.25em] font-semibold",
  digitCount: "text-caption text-ink-muted",
  submitButton: "w-full",
} as const;
