export const headerStyles = {
  headerBase:
    "sticky top-0 z-40 overflow-visible transition-all duration-200 h-14 lg:h-[72px]",
  headerTransparent: "bg-transparent border-transparent",
  headerSolid: "bg-surface border-b border-line shadow-elevation-1",
  container:
    "storefront-container flex h-full flex-nowrap items-center gap-1.5 sm:gap-3 lg:gap-4 xl:gap-6",
  brandName:
    "min-w-0 shrink truncate text-[1.25rem] font-display font-semibold leading-none sm:text-[1.5rem] lg:text-[1.625rem] xl:text-[1.75rem]",
  brandNameTransparent: "text-paper",
  brandNameSolid: "text-brand",
  spacer: "hidden flex-1 xl:block",
  actionsNav:
    "ml-auto flex shrink-0 items-center gap-1.5 overflow-visible sm:gap-2",

  // Skeletons
  iconButtonBox: "h-11 w-11 shrink-0 rounded-md max-sm:h-9 max-sm:w-9",
  ordersSkeleton: "hidden xl:flex items-center gap-1",
  ordersSkeletonBox: "h-8 w-[4.25rem] rounded-md",
  accountSkeletonPill: "border-line bg-surface",
  avatarSkeleton: "size-7 rounded-full sm:size-8",
  chevronSlot: "hidden size-3 shrink-0 sm:block",
  textSkeletonWrapper: "relative inline-flex",
  primaryNavSkeleton: "hidden xl:flex items-center gap-1",
  navCategoriesText:
    "inline-flex h-11 items-center gap-1 px-4 text-[0.875rem] sm:px-5 sm:text-body",
  navCategoriesIconSlot: "size-4",
  navLinkText: "inline-block px-3 py-2 text-body-sm font-medium",
  searchSkeletonWrapper: "mx-auto hidden max-w-xl flex-1 xl:flex",
  searchSkeletonInput: "h-11 w-full rounded-full",
  menuButtonSkeleton:
    "-ml-2 h-11 w-11 shrink-0 rounded-md xl:hidden max-sm:h-9 max-sm:w-9",
  searchButtonSkeleton: "hidden lg:block xl:hidden",

  // Desktop Primary Nav
  desktopNav: "hidden xl:flex items-center gap-1",
  relativeWrapper: "relative",
  categoriesButtonBase: "gap-1",
  categoriesButtonTransparent: "text-paper hover:bg-paper/10 hover:text-paper",
  categoriesChevron: "transition-transform",
  categoriesChevronOpen: "rotate-180",
  primaryLink:
    "px-3 py-2 rounded-md text-body-sm font-medium transition-colors",
  primaryLinkTransparent: "text-paper hover:bg-paper/10",
  primaryLinkSolid: "text-ink hover:bg-paper",
  searchWrapper: "hidden xl:flex flex-1 max-w-xl mx-auto",

  // Account Section
  loginLink:
    "hidden sm:inline-flex items-center px-3 py-1.5 text-body-sm font-medium rounded-md transition-colors",
  loginLinkTransparent: "text-paper hover:bg-paper/10",
  loginLinkSolid: "text-ink hover:bg-paper",
  ordersLinkWrapper: "hidden xl:flex items-center gap-1",
  ordersLink:
    "px-3 py-1.5 text-body-sm font-medium rounded-md transition-colors",
  ordersLinkTransparent: "text-paper hover:bg-paper/10",
  ordersLinkSolid: "hover:bg-paper",
  dashboardLink:
    "hidden xl:inline-flex items-center px-3 py-1.5 text-body-sm font-medium rounded-md transition-colors",
  dashboardLinkTransparent: "text-paper hover:bg-paper/10",
  dashboardLinkSolid: "text-brand hover:bg-brand-subtle",

  // Account Menu
  triggerSvgSize: "[&_svg]:!size-[0.875rem] sm:[&_svg]:!size-3",
  triggerTransparent: "border-paper/20 hover:bg-paper/10",
  triggerSolid: "border-line bg-surface hover:bg-paper",
  avatar: "size-7 border-0 sm:size-8 sm:border sm:border-line/70",
  avatarFallback:
    "flex items-center justify-center bg-brand-subtle text-[0.6875rem] font-semibold leading-none text-ink sm:text-[0.75rem]",
  userRoundIcon: "block shrink-0",
  accountChevron: "hidden shrink-0 sm:block transition-transform",
  accountChevronTransparent: "text-paper",
  accountChevronSolid: "text-ink-muted",
  accountChevronOpen: "rotate-180",
  dropdown: "absolute right-0 top-full z-50 w-60 pt-2.5",
  dropdownMenu:
    "overflow-hidden border border-line bg-surface shadow-elevation-4",
  userHeader: "border-b border-line bg-paper/60 px-4 py-3",
  userName: "truncate text-[0.875rem] font-medium text-ink",
  userEmail: "truncate text-[0.75rem] text-ink-muted",
  linksList: "py-1.5",
  menuItem:
    "block px-4 py-2.5 text-[0.875rem] text-ink-muted transition-colors hover:bg-paper hover:text-ink",

  // Header Menu Button
  storefrontMenuButton:
    "xl:hidden -ml-2 max-sm:h-9 max-sm:w-9 max-sm:min-h-9 max-sm:max-h-9",
  storefrontHoverTransparent: "hover:bg-paper/10",
  workspaceMenuButton: "lg:hidden -ml-2",
  workspaceMenuIcon: "text-ink",
} as const;
