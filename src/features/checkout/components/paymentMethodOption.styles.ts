import { cn } from "@/shared/utils/cn";

export const PAYMENT_METHOD_OPTION_STYLES = {
  button: (selected: boolean) =>
    cn(
      "h-auto min-h-11 max-h-none w-full items-start gap-4 px-4 py-4 text-left font-normal",
      selected
        ? "border-brand bg-brand-subtle shadow-[inset_3px_0_0_0_var(--brand)] hover:bg-brand-subtle hover:text-ink"
        : "border-line hover:border-ink/25",
    ),
  iconWrapper: (selected: boolean) =>
    cn(
      "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border",
      selected
        ? "border-brand/40 bg-surface text-brand"
        : "border-line bg-paper text-ink-muted",
    ),
  textWrapper: "min-w-0 flex-1",
  title: "block font-medium text-ink",
  description: "mt-0.5 block text-[0.875rem] text-ink-muted",
  indicatorRing: (selected: boolean) =>
    cn(
      "mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
      selected ? "border-brand bg-brand" : "border-line bg-surface",
    ),
  indicatorDot: "h-1.5 w-1.5 rounded-full bg-paper",
  wrapper: "w-full",
} as const;
