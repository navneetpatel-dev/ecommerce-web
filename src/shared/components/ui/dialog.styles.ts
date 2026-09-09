export const dialogStyles = {
  overlay: "fixed inset-0 z-50 animate-fade-in bg-overlay",
  closeButtonWrap: "flex shrink-0 items-center justify-end",
  closeButtonWrapFullscreen: "fixed right-3 top-3 z-[60]",
  closeButtonWrapDefault: "px-3 pt-2.5 pb-0.5",
  closeButtonBase:
    "inline-flex size-7 items-center justify-center rounded-sm text-ink-muted opacity-70 transition-all hover:bg-surface hover:text-ink hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
  closeButtonFullscreen:
    "rounded-full border border-line bg-surface/90 p-2 opacity-100 shadow-elevation-1 backdrop-blur-sm",
  srOnly: "sr-only",
  portalWrap: "fixed inset-0 z-50 pointer-events-none",
  portalWrapFullscreen: "p-0",
  portalWrapDefault: "flex items-center justify-center p-4",
  contentBase:
    "pointer-events-auto overscroll-contain outline-none animate-scale-in flex flex-col",
  contentFullscreen:
    "fixed inset-0 flex h-[100dvh] w-full max-h-none max-w-none flex-col overflow-hidden border-0 bg-transparent p-0 shadow-none rounded-none",
  contentDefault:
    "relative w-full max-w-[480px] max-h-[calc(100dvh-2rem)] overflow-hidden border border-line bg-surface-raised shadow-elevation-3 rounded-lg",
  bodyBase: "min-h-0 flex-1 flex flex-col overflow-y-auto",
  bodyPadding: "px-5 pb-5 sm:px-6 sm:pb-6 gap-5 sm:gap-6",
  header: "flex flex-col space-y-1.5 text-center sm:text-left",
  footer: "dialog-footer",
  title: "text-[1.375rem] font-semibold leading-tight tracking-tight",
  description: "text-body-sm text-ink-muted",
} as const;
