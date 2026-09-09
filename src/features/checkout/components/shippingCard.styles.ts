import { cn } from "@/shared/utils/cn";

export const SHIPPING_CARD_STYLES = {
  card: "border border-line bg-surface-raised p-4 shadow-elevation-1 md:p-5",
  loadingText: "mt-4 text-[0.875rem] text-ink-muted",
  errorText: "mt-4 text-[0.875rem] text-red-600",
  emptyText: "mt-4 text-[0.875rem] text-ink-muted",
  optionsGrid: "mt-4 grid gap-2 sm:grid-cols-2",
  rateButton: (isSelected: boolean) =>
    cn(
      "h-auto min-h-11 max-h-none px-4 py-3.5 text-left font-normal",
      isSelected
        ? "border-brand bg-brand-subtle shadow-[inset_3px_0_0_0_var(--brand)] hover:bg-brand-subtle hover:text-ink"
        : "border-line hover:border-ink/25",
    ),
  rateButtonContent: "flex w-full items-baseline justify-between gap-3",
  rateLabel: "font-medium text-ink",
  rateCost: "font-mono text-[0.875rem] tabular-nums text-ink",
  rateDays: "mt-1 text-body-sm text-ink-muted",
} as const;
