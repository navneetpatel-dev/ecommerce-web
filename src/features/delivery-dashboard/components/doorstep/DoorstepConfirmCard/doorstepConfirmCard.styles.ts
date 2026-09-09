export const doorstepConfirmCardStyles = {
  container: "border border-line bg-surface shadow-elevation-1",
  header:
    "flex items-center justify-between border-b border-line bg-paper/55 px-5 py-3.5",
  headerLeft: "flex items-center gap-2",
  headerIcon: "size-4 text-brand",
  headerEyebrow: "!mb-0",
  headerBadge: "text-caption font-medium uppercase tracking-wider text-brand",
  body: "space-y-5 p-5 md:p-6",
  title: "font-display text-[1.125rem] font-medium text-ink",
  subtitle: "mt-1 text-body-sm text-ink-muted",
  passcodeBox: "rounded-lg border border-line bg-paper/40 p-4 space-y-3",
  passcodeHeader: "flex flex-wrap items-center justify-between gap-2",
  passcodeLabel: "text-body-sm font-medium text-ink",
  passcodeExpiry: "text-body-sm text-success",
  passcodeInputRow: "flex items-center gap-3",
  passcodeInput:
    "max-w-[180px] text-center font-mono text-xl tracking-[0.25em] font-semibold",
  passcodeDigits: "text-caption text-ink-muted",
  proofBox:
    "rounded-lg border border-dashed border-line bg-paper/20 p-4 transition-colors hover:border-brand/40",
  proofLabel:
    "flex cursor-pointer flex-col items-center justify-center gap-2 text-center",
  proofIconWrapper:
    "flex size-8 items-center justify-center rounded-full border border-line bg-surface text-brand",
  proofIcon: "size-4",
  proofText: "text-body-sm font-medium text-ink",
  proofInput: "sr-only",
  codBox: "rounded-lg border border-line bg-warning/10 p-4 space-y-2",
  codHeader: "flex items-center gap-2 text-body-sm font-medium text-ink",
  codIcon: "size-4 text-warning",
  submitButton: "w-full",
} as const;
