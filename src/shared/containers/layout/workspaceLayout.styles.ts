export const workspaceLayoutStyles = {
  root: "min-h-screen bg-paper",
  bodyFlex: "flex min-w-0",
  main: "min-w-0 flex-1 overflow-x-hidden bg-surface p-4 sm:p-6 lg:p-8",
  deliveryMain:
    "min-w-0 flex-1 overflow-x-hidden bg-surface p-4 pb-20 sm:p-6 sm:pb-8 lg:p-8",
  adminSidebarHeader: "mb-4 flex items-center gap-2 px-3 py-2",
  adminSidebarIcon: "h-5 w-5 text-brand",
  adminSidebarTitle: "text-[1.125rem] font-semibold text-brand",
} as const;
