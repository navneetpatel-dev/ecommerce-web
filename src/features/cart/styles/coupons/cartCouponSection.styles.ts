import { cn } from "@/shared/utils/dom/cn";

export const cartCouponSectionStyles = {
  root: (compact?: boolean) => (compact ? "space-y-2" : "space-y-3"),
  inputRow: "flex w-full items-stretch gap-2",
  input: "min-w-0 flex-1",
  applyButtonWrapper: "shrink-0",
  applyButton: "shrink-0 px-4",
  successMessage: "text-body-sm text-success",
  infoMessage: "text-body-sm text-ink-muted",
  errorMessage: "text-body-sm text-danger",
  accordionItem: "border-0",
  accordionTrigger: (compact?: boolean) =>
    cn(
      "py-2 text-[0.75rem] font-medium uppercase tracking-[0.06em] text-ink-muted hover:text-ink",
      compact && "py-1.5",
    ),
  accordionContent: "pb-0",
  offersList: (compact?: boolean) => cn(compact ? "space-y-1.5" : "space-y-2"),
  offerRow: "flex items-start justify-between gap-2 text-body-sm",
  offerText: "flex min-w-0 flex-1 flex-col gap-0.5",
  offerName: "break-words text-ink",
  offerDetail:
    "flex flex-wrap items-center gap-x-2 text-[0.75rem] text-ink-muted",
  offerCode: "font-mono text-ink-muted",
  offerButton: "shrink-0",
  offersToggle:
    "h-auto px-0 py-1 text-[0.75rem] text-brand hover:bg-transparent",
  statusMessage: "text-body-sm text-ink-muted",
} as const;
