import { cn } from "@/shared/utils/cn";

export const filterSidebarStyles = {
  aside: (className?: string) =>
    cn(className ?? "hidden w-64 shrink-0 xl:block"),
  container: "sticky top-[88px] space-y-5",
  header: "flex items-end justify-between gap-3 border-b border-line pb-3",
  headerTitle: "text-body-lg font-semibold text-ink",
  clearAllButton:
    "h-auto min-h-0 max-h-none gap-1 px-2 py-1 text-[0.75rem] font-medium text-brand hover:bg-transparent hover:text-brand-hover",
  priceRow: "flex items-center gap-2",
  priceSeparator: "text-body-sm text-ink-faint",
  ratingGroup: "gap-2.5",
  ratingOptionRow: "flex items-center gap-2.5",
  ratingLabel: "cursor-pointer text-body-sm font-normal text-ink",
  clearRatingButton:
    "mt-3 h-auto min-h-0 max-h-none px-0 py-0 text-body-sm font-medium text-brand hover:bg-transparent hover:text-brand-hover",
  facetList: "space-y-2",
  checkboxField: (disabled: boolean, checked: boolean) =>
    cn("w-full gap-2.5 text-body-sm", disabled && !checked && "text-ink-faint"),
  checkboxLabel: "flex items-center justify-between gap-2",
  optionValue: "min-w-0 truncate capitalize",
  optionCount: "shrink-0 tabular-nums text-ink-faint",
} as const;
