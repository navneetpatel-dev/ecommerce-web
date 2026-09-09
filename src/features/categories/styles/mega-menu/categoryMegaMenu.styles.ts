import { cn } from "@/shared/utils/dom/cn";

export const categoryMegaMenuStyles = {
  menuContainer:
    "absolute left-0 top-full z-50 mt-3 w-[min(980px,calc(100vw-2rem))] overflow-hidden rounded-xl border border-line bg-surface-raised shadow-elevation-2",
  header:
    "flex flex-wrap items-center justify-between gap-3 border-b border-line bg-paper/50 px-4 py-3.5 sm:px-5",
  headerTitle: "text-[0.875rem] font-semibold text-ink",
  headerSubtitle: "mt-0.5 text-[0.75rem] text-ink-muted",
  headerAllCategoriesLink:
    "inline-flex items-center gap-1 rounded-full border border-line bg-surface px-3 py-1.5 text-body-sm font-medium text-brand transition-colors hover:border-brand/30 hover:bg-brand-subtle",
  headerArrowIcon: "h-3 w-3",
  bodyGrid: "grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_240px]",
  scrollArea:
    "max-h-[min(62vh,520px)] overflow-y-auto overscroll-contain p-3 sm:p-4",
  emptyText: "px-2 py-10 text-center text-body text-ink-muted",
  tilesGrid: "grid gap-3 sm:grid-cols-2 xl:grid-cols-3",
  aside:
    "border-t border-line bg-gradient-to-br from-brand-subtle via-paper to-surface p-5 lg:border-l lg:border-t-0",
  asideContent: "flex h-full flex-col justify-between gap-5",
  sparklesBadge:
    "inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand/10 text-brand",
  sparklesIcon: "h-4 w-4",
  asideTitle: "mt-3 font-display text-[1.125rem] leading-snug text-ink",
  asideSubtitle: "mt-1.5 text-body-sm leading-relaxed text-ink-muted",
  asideCta:
    "inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-brand px-4 py-2.5 text-body-sm font-semibold text-paper transition-colors hover:bg-brand-hover sm:w-auto",
  asideArrowIcon: "h-3.5 w-3.5",
  tileItem: "min-w-0",
  tileCard: cn(
    "group/tile h-full rounded-lg border border-line bg-paper/40 p-3 transition-all duration-200",
    "hover:border-brand/30 hover:bg-paper hover:shadow-elevation-1",
  ),
  tileHeaderLink:
    "mb-3 flex items-start gap-3 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
  tileIconWrapper:
    "relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-brand-subtle text-brand transition-colors group-hover/tile:bg-brand group-hover/tile:text-paper",
  tileCoverImage: "object-cover",
  tileMediaImage: "absolute inset-0",
  tileIcon: "h-4 w-4",
  tileTextWrapper: "min-w-0 flex-1 pt-0.5",
  tileTitleRow: "flex items-center gap-1.5",
  tileName:
    "truncate text-[0.875rem] font-semibold text-ink transition-colors group-hover/tile:text-brand",
  tileArrowIcon:
    "h-3.5 w-3.5 shrink-0 text-ink-faint opacity-0 transition-all group-hover/tile:translate-x-0.5 group-hover/tile:-translate-y-0.5 group-hover/tile:opacity-100 group-hover/tile:text-brand",
  tileChildCount: "mt-0.5 block text-[0.6875rem] text-ink-faint",
  childrenList: "flex flex-wrap gap-1.5",
  childPill: cn(
    "inline-flex max-w-full items-center rounded-full border border-line bg-surface px-2.5 py-1",
    "text-[0.6875rem] font-medium text-ink-muted transition-colors",
    "hover:border-brand/25 hover:bg-brand-subtle hover:text-brand",
  ),
  childPillName: "truncate",
  moreChildrenLink:
    "inline-flex items-center rounded-full px-2 py-1 text-[0.6875rem] font-medium text-brand hover:underline",
} as const;
