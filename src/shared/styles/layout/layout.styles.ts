import { MOBILE_TAB_BAR_HEIGHT_CLASS } from "@/shared/constants/layout/mobileRails";
import { OVERLAY_BACKDROP } from "../common.styles";

export const mobileTabBarStyles = {
  nav: `fixed bottom-0 left-[env(safe-area-inset-left,0px)] right-[env(safe-area-inset-right,0px)] z-40 flex ${MOBILE_TAB_BAR_HEIGHT_CLASS} items-stretch justify-around overflow-visible border-t border-line bg-surface lg:hidden`,
  tabItem:
    "flex min-h-11 min-w-[3.25rem] flex-col items-center justify-center gap-0.5 overflow-visible px-2 py-1 text-ink-muted",
  textLabel: "text-[0.625rem] max-md:landscape:hidden",
  textLabelNormal: "text-[0.625rem] font-normal max-md:landscape:hidden",
  skeletonIcon: "size-5 rounded-md",
  skeletonLabelW8: "h-2 w-8 rounded-sm",
  skeletonLabelW6: "h-2 w-6 rounded-sm",
  searchButton:
    "flex min-h-11 min-w-[3.25rem] flex-col items-center justify-center gap-0.5 overflow-visible px-2 py-1 text-ink-muted h-auto max-h-none w-auto hover:bg-transparent hover:text-ink-muted",
  cartButton:
    "flex min-h-11 min-w-[3.25rem] flex-col items-center justify-center gap-0.5 px-2 py-1 text-ink-muted h-auto max-h-none w-auto !overflow-visible hover:bg-transparent hover:text-ink-muted",
} as const;

export const sidebarNavStyles = {
  aside:
    "sticky top-14 z-20 hidden h-[calc(100dvh-3.5rem)] w-60 shrink-0 self-start lg:top-[72px] lg:flex lg:h-[calc(100dvh-72px)] lg:flex-col border-r border-line",
  asideDashboard: "bg-paper",
  asideSurface: "bg-surface",
  headerWrapper: "shrink-0 px-4 pt-4 pb-0",
  nav: "min-h-0 flex-1 space-y-1 overflow-y-auto overscroll-contain px-4 pb-4",
  navWithHeader: "pt-1",
  navWithoutHeader: "pt-4",
  linkBase:
    "flex h-11 items-center gap-3 rounded-md border-l-[3px] px-3 text-body-sm font-medium transition-colors",
  linkActive: "border-l-brand bg-brand-subtle text-brand",
  linkInactive:
    "border-l-transparent text-ink-muted hover:bg-brand-subtle hover:text-ink",
} as const;

export const workspaceNavDrawerStyles = {
  backdropWrapper: "fixed inset-0 z-50 lg:hidden",
  backdrop: OVERLAY_BACKDROP,
  panel:
    "absolute left-[env(safe-area-inset-left,0px)] top-0 bottom-[env(safe-area-inset-bottom,0px)] flex w-72 flex-col bg-surface pt-[env(safe-area-inset-top,0px)] shadow-elevation-4 animate-slide-in-left",
  header: "flex h-14 items-center justify-between border-b border-line px-4",
  title: "text-[1.125rem] font-semibold text-brand",
  closeButton: "text-ink-muted hover:text-ink",
  nav: "flex-1 space-y-1 overflow-y-auto p-4",
} as const;
