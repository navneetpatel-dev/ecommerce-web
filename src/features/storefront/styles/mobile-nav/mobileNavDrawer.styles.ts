import { OVERLAY_BACKDROP } from "@/shared/styles/common.styles";

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
    "flex items-center px-3 py-2.5 rounded-md text-body font-medium hover:bg-paper transition-colors",
  skeletonWrapper: "mt-4 space-y-2 px-3",
  skeletonTitle: "h-4 w-16",
  skeletonItem: "h-10 w-full",
  accountHeading: "px-3 py-2 text-body-sm font-medium text-ink-muted mt-4",
  accountLink:
    "flex items-center px-3 py-2.5 rounded-md text-body hover:bg-paper transition-colors",
  loginLink:
    "flex items-center px-3 py-2.5 rounded-md text-body font-medium text-brand hover:bg-brand-subtle transition-colors mt-4",
  categoryHeaderRow: "mt-4 px-3 py-2 flex items-center justify-between",
  categoryHeaderTitle: "text-body-sm font-medium text-ink-muted",
  viewAllLink:
    "inline-flex items-center gap-0.5 text-[0.75rem] font-medium text-brand",
  arrowIcon: "h-3 w-3",
  emptyText: "px-3 py-2 text-body-sm text-ink-faint",
  departmentList: "space-y-1",
  departmentLink:
    "flex items-center gap-3 px-3 py-2.5 rounded-md text-body font-medium hover:bg-paper transition-colors",
  departmentIcon: "h-4 w-4 shrink-0 text-ink-muted",
  truncateText: "truncate",
  childrenList: "ml-4 space-y-0.5 border-l border-line pl-2",
  childLink:
    "block truncate rounded-md px-2 py-1.5 text-body-sm font-medium text-ink-muted hover:bg-paper hover:text-ink",
  leafList: "ml-2 space-y-0.5",
  leafLink:
    "block truncate rounded-md px-2 py-1 text-[0.75rem] text-ink-faint hover:bg-paper hover:text-ink",
} as const;
