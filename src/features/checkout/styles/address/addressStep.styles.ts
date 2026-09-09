import { cn } from "@/shared/utils/dom/cn";

export const ADDRESS_STEP_STYLES = {
  root: "space-y-5",
  headerRow: "flex flex-wrap items-center justify-between gap-3",
  countText: "text-[0.875rem] text-ink-muted",
  addAddressBtn: "gap-2",
  emptyContainer: cn(
    "flex flex-col items-start gap-5 border border-dashed border-line bg-paper/50 px-6 py-10 md:px-8 md:py-12",
  ),
  emptyIconWrapper:
    "flex h-12 w-12 items-center justify-center rounded-full border border-line bg-surface text-brand",
  emptyTitle: "font-display text-[1.25rem] text-ink",
  emptyDescription:
    "mt-2 max-w-[40ch] text-body leading-relaxed text-ink-muted",
  list: "space-y-3",
  addressButton: (selected: boolean) =>
    cn(
      "h-auto min-h-11 max-h-none w-full px-4 py-4 text-left font-normal",
      selected
        ? "border-brand bg-brand-subtle shadow-[inset_3px_0_0_0_var(--brand)] hover:bg-brand-subtle hover:text-ink"
        : "border-line hover:border-ink/25",
    ),
  addressContent: "flex w-full items-start justify-between gap-3",
  addressDetails: "min-w-0",
  addressLine1: "font-medium text-ink",
  addressLine2: "mt-1 text-[0.875rem] text-ink-muted",
  addressCountry: "mt-0.5 text-body-sm text-ink-muted",
  indicatorRing: (selected: boolean) =>
    cn(
      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
      selected ? "border-brand bg-brand" : "border-line bg-surface",
    ),
  indicatorDot: "h-1.5 w-1.5 rounded-full bg-paper",
  defaultBadge:
    "mt-3 inline-block text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-brand",
  actionHint: "w-full sm:w-auto",
  continueButton: "gap-2",
} as const;
