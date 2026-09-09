import { cn } from "@/shared/utils/cn";

export const variantSelectorStyles = {
  root: (className?: string) => cn("space-y-5", className),
  groupsWrapper: "space-y-4",
  groupHeader: "mb-2.5 flex items-baseline justify-between gap-3",
  groupTitle:
    "text-body-sm font-semibold uppercase tracking-[0.08em] text-ink-muted",
  groupSelected: "truncate text-body-sm font-medium text-ink",
  valuesList: "flex flex-wrap gap-2",
  optionButton: (active: boolean, available: boolean) =>
    cn(
      "h-10 min-h-10 max-h-none rounded-full px-4 font-medium transition-all",
      active
        ? "border-brand bg-brand text-paper hover:bg-brand-hover hover:text-paper"
        : available
          ? "border-line bg-surface hover:border-brand hover:text-brand"
          : "border-line bg-paper text-ink/30 line-through",
    ),
  priceWrapper: "flex items-baseline gap-3",
  currentPrice: "font-sans text-[1.75rem] font-semibold text-brand",
  basePrice: "text-body-lg text-ink-faint line-through",
  stockWrapper: "space-y-3",
  badgesRow: "flex flex-wrap items-center gap-2",
  freeShippingText: "text-body-sm text-ink-muted",
  addToCartButton: "w-full",
} as const;
