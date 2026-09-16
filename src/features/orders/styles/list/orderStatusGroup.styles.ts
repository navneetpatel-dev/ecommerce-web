import { cn } from "@/shared/utils/dom/cn";

export type Tone = "neutral" | "progress" | "positive" | "caution" | "danger";

export const ORDER_STATUS_GROUP_STYLES = {
  compactGroup: (className?: string) =>
    cn(
      "grid w-full grid-cols-[1fr_auto] items-center gap-x-2.5 gap-y-1.5",
      className,
    ),
  comfortableGroup: (className?: string) =>
    cn("flex flex-wrap items-start gap-5", className),
  badgeContainer: "min-w-[8.5rem]",
  badgeLabel:
    "text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-ink-faint",
  badgeWrapper: "mt-1.5",
  badge: "px-1.5 py-0.5 text-[0.6875rem] font-medium",
  compactLine: "contents",
  compactField:
    "whitespace-nowrap text-[0.625rem] font-medium uppercase tracking-[0.06em] text-ink-faint",
  compactValue: (toneClass: string) =>
    cn(
      "inline-flex items-center gap-1.5 whitespace-nowrap text-[0.75rem] leading-none",
      toneClass,
    ),
  compactDot: (dotClass: string) =>
    cn("h-1.5 w-1.5 shrink-0 rounded-full", dotClass),
  compactText: "font-medium tracking-tight",
} as const;

export const TONE_CLASS: Record<Tone, string> = {
  neutral: "text-ink-muted",
  progress: "text-brand",
  positive: "text-success",
  caution: "text-warning",
  danger: "text-danger",
};

export const DOT_CLASS: Record<Tone, string> = {
  neutral: "bg-ink-faint",
  progress: "bg-brand",
  positive: "bg-success",
  caution: "bg-warning",
  danger: "bg-danger",
};
