import { OVERLAY_BACKDROP } from "@/shared/styles/common.styles";
import { cn } from "@/shared/utils/dom/cn";

export const mobileNavDrawerStyles = {
  overlayWrapper: "fixed inset-0 z-50 xl:hidden",
  backdrop: OVERLAY_BACKDROP,
  drawer:
    "absolute left-[env(safe-area-inset-left,0px)] top-0 bottom-[env(safe-area-inset-bottom,0px)] w-72 bg-surface pt-[env(safe-area-inset-top,0px)] shadow-elevation-4 animate-slide-in-left flex flex-col",
  header: "flex items-center justify-between px-4 h-14 border-b border-line",
  title: "text-[1.125rem] font-semibold text-brand",
  closeButton: "text-ink-muted",
  nav: "flex-1 overflow-y-auto py-4 px-2",
  navLink:
    "flex items-center px-3 py-2.5 rounded-md text-body font-medium hover:bg-brand-subtle transition-colors",
  skeletonWrapper: "mt-4 space-y-2 px-3",
  skeletonTitle: "h-4 w-16",
  skeletonItem: "h-10 w-full",
  accountHeading: "px-3 py-2 text-body-sm font-medium text-ink-muted mt-4",
  accountLink:
    "flex items-center px-3 py-2.5 rounded-md text-body hover:bg-brand-subtle transition-colors",
  loginLink:
    "flex items-center px-3 py-2.5 rounded-md text-body font-medium text-brand hover:bg-brand-subtle transition-colors mt-4",

  /*
   * Categories — the navbar's tile language (department tile with a brand icon square and
   * child pills), re-sized for the drawer's left column and collapsed into dropdowns: the
   * section opens from the "Categories" row, each department drops its pills down when
   * tapped. Deliberately a local copy of that look: the mega menu is a wide hover panel and
   * must not inherit drawer spacing.
   */
  categorySection: "mt-5 space-y-2",
  categoryHeaderRow: "flex items-center justify-between gap-2 px-3",
  categoryToggle:
    "flex min-w-0 flex-1 items-center justify-between gap-2 rounded-md py-1 text-left outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
  categoryToggleText: "flex min-w-0 items-center gap-2",
  categoryChevron:
    "h-4 w-4 shrink-0 text-ink-muted transition-transform duration-200",
  categoryChevronOpen: "rotate-180",
  categoryHeaderTitle: "truncate text-[0.875rem] font-semibold text-ink",
  /** How many categories the drawer is holding — a chip, not a line of copy. */
  categoryCountPill:
    "inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full border border-brand/25 bg-brand-subtle px-1.5 text-[0.6875rem] font-semibold tabular-nums leading-none text-brand",
  /** The pill is a bare number on screen; this carries it for assistive tech. */
  categoryCountSrText: "sr-only",
  categoryEmptyText: "px-3 py-2 text-body-sm text-ink-faint",
  viewAllLink:
    "inline-flex shrink-0 items-center gap-1 rounded-full border border-line bg-surface px-3 py-1.5 text-body-sm font-medium text-brand transition-colors hover:border-brand/30 hover:bg-brand-subtle",
  arrowIcon: "h-3 w-3",
  categoryList: "space-y-2 px-3",
  categoryTile: cn(
    "group/tile rounded-lg border border-line bg-paper/40 transition-all duration-200",
    "hover:border-brand/30 hover:bg-brand-subtle hover:shadow-elevation-1",
  ),
  categoryTileOpen: "border-brand/30 bg-brand-subtle shadow-elevation-1",
  categoryTileHeader:
    "flex w-full items-center gap-3 rounded-lg p-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
  categoryIconWrapper:
    "relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-brand-subtle text-brand transition-colors group-hover/tile:bg-brand group-hover/tile:text-paper",
  categoryCoverImage: "object-cover",
  categoryCoverLayer: "absolute inset-0",
  categoryIcon: "h-4 w-4",
  categoryTextWrapper: "min-w-0 flex-1",
  categoryName:
    "block truncate text-[0.875rem] font-semibold text-ink transition-colors group-hover/tile:text-brand",
  categoryChildCount: "mt-0.5 block text-[0.6875rem] text-ink-faint",
  categoryPanel: "space-y-2 px-3 pb-3",
  categoryPills: "flex flex-wrap gap-1.5",
  categoryPill: cn(
    "inline-flex max-w-full items-center rounded-full border border-line bg-surface px-2.5 py-1",
    "text-[0.6875rem] font-medium text-ink-muted transition-colors",
    "hover:border-brand/25 hover:bg-brand-subtle hover:text-brand",
  ),
  categoryPillName: "truncate",
  categoryMoreLink:
    "inline-flex items-center rounded-full px-2 py-1 text-[0.6875rem] font-medium text-brand hover:underline",
  categoryDepartmentLink:
    "inline-flex items-center gap-1 text-[0.75rem] font-medium text-brand hover:underline",
} as const;
