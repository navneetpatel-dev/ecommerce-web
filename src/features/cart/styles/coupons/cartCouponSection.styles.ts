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
  offersList: (compact?: boolean) =>
    cn(
      "space-y-1.5 overflow-y-auto overscroll-contain pr-1",
      compact ? "max-h-36" : "max-h-48",
    ),
  offerRow: "flex items-center justify-between gap-2 text-body-sm",
  offerCode: "min-w-0 truncate font-mono text-ink",
  offerButton: "shrink-0",
  statusMessage: "text-body-sm text-ink-muted",
} as const;
