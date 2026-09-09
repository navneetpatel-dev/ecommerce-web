import { cn } from "@/shared/utils/cn";

export const analyticsOpsQueuesStyles = {
  card: (hasAttention: boolean) =>
    cn(
      "overflow-hidden",
      hasAttention &&
        "border-warning/30 bg-gradient-to-r from-warning-subtle/40 to-surface",
    ),
  header: "flex-row items-center justify-between gap-3 space-y-0 pb-3",
  titleGroup: "flex items-center gap-2",
  attentionIcon: (hasAttention: boolean) =>
    cn("h-4 w-4", hasAttention ? "text-warning" : "text-ink-faint"),
  title: "text-body-lg",
  grid: "grid gap-3 sm:grid-cols-3",
  queueLink:
    "group flex items-center justify-between gap-3 rounded-md border border-line bg-surface/80 px-4 py-3 transition-colors hover:border-brand/35 hover:bg-brand-subtle/40",
  leftGroup: "flex min-w-0 items-center gap-3",
  iconWrapper:
    "flex h-9 w-9 items-center justify-center rounded-md bg-paper text-ink-muted group-hover:text-brand",
  icon: "h-4 w-4",
  queueLabel: "truncate text-[0.875rem] text-ink-muted",
  countText: "font-mono text-[1.125rem] font-semibold text-ink",
} as const;
