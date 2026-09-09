import { cn } from "@/shared/utils/dom/cn";

export const adminSectionTabsStyles = {
  root: (className?: string) => cn("min-w-0 space-y-6", className),
  header: "space-y-1",
  title:
    "font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl",
  description: "max-w-2xl text-body text-ink-muted",
  tabsRoot: "min-w-0",
  tabsList: cn(
    "flex h-auto w-full flex-wrap justify-start gap-1 rounded-md border border-line-strong",
    "bg-paper p-1",
  ),
  tabTrigger: cn(
    "group gap-2 rounded-sm border-0 border-b-0 px-4 py-2.5 text-body-sm",
    "text-ink-muted hover:text-ink",
    "data-[state=active]:bg-brand data-[state=active]:text-paper",
    "data-[state=active]:hover:bg-brand-hover data-[state=active]:hover:text-paper",
    "data-[state=active]:shadow-none",
  ),
  badge: cn(
    "inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full px-1.5",
    "text-[0.6875rem] font-bold leading-none tabular-nums",
    "bg-accent text-paper shadow-sm",
    "group-data-[state=active]:bg-paper group-data-[state=active]:text-brand",
    "group-data-[state=active]:shadow-none",
  ),
  tabContent: "mt-6 min-w-0 focus-visible:outline-none",
} as const;
