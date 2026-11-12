/**
 * Named class groups for App Router error boundaries (Rule 5). The fallback
 * body itself is the shared `ErrorState`; these cover the recovery buttons and
 * the bare workspace shell admin/vendor boundaries draw around it.
 */
export const errorBoundaryStyles = {
  actions:
    "flex w-full flex-col items-stretch gap-2.5 xs:w-auto xs:flex-row xs:items-center xs:justify-center",
  actionButton: "w-full xs:w-auto xs:min-w-[9.5rem]",
  workspaceShell: "min-h-[100dvh] bg-paper",
  workspaceHeader: "h-14 border-b border-line",
  workspaceBody: "flex",
  workspaceSidebar:
    "hidden w-56 shrink-0 border-r border-line min-h-[calc(100dvh-3.5rem)] md:block",
  workspaceMain: "flex min-w-0 flex-1 items-center justify-center outline-none",
} as const;
