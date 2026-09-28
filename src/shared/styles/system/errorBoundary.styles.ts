/**
 * Named class groups for App Router error boundaries (Rule 5).
 */
export const errorBoundaryStyles = {
  root: "flex min-h-[60dvh] flex-col items-center justify-center gap-4 p-8",
  heading: "text-[1.375rem] font-semibold text-ink",
  body: "max-w-md text-center text-body text-ink-muted",
  actions: "flex gap-2",
  screenCenter: "flex min-h-[100dvh] items-center justify-center bg-paper p-8",
  screenCenterCol:
    "flex min-h-[100dvh] flex-col items-center justify-center gap-4 bg-paper p-8",
  workspaceShell: "min-h-[100dvh] bg-paper",
  workspaceHeader: "h-14 border-b border-line",
  workspaceBody: "flex",
  workspaceSidebar:
    "w-56 shrink-0 border-r border-line min-h-[calc(100dvh-3.5rem)]",
  workspaceMain:
    "flex-1 p-6 flex flex-col items-center justify-center gap-4 outline-none",
} as const;
