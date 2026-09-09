import { cn } from "@/shared/utils/cn";

export const cardQuantityControlStyles = {
  root: (className?: string) =>
    cn(
      "flex w-full items-center justify-between rounded-full border border-line bg-surface/95 backdrop-blur-xs shadow-elevation-1",
      className,
    ),
  controlButton:
    "relative z-[1] h-9 w-9 min-h-9 max-h-9 shrink-0 rounded-full hover:bg-paper",
  animatedWrapper: "h-5 w-8",
  animatedDigit: "font-mono text-[0.875rem] font-semibold text-ink",
} as const;
