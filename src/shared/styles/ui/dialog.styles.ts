export const dialogStyles = {
  overlay: "fixed inset-0 z-50 animate-fade-in bg-overlay",
  closeButtonWrap: "flex shrink-0 items-center justify-end",
  closeButtonWrapFullscreen: "fixed right-3 top-3 z-[60]",
  closeButtonWrapDefault: "px-3 pt-3 pb-0",
  closeButtonWrapCorner: "absolute right-3 top-3.5 z-20",
  portalWrap: "fixed inset-0 z-50 pointer-events-none",
  portalWrapFullscreen: "p-0",
  portalWrapDefault: "flex items-center justify-center p-4",
  contentBase:
    "pointer-events-auto overscroll-contain outline-none animate-scale-in flex flex-col",
  contentFullscreen:
    "fixed inset-0 flex h-[100dvh] w-full max-h-none max-w-none flex-col overflow-hidden border-0 bg-transparent p-0 shadow-none rounded-none",
  contentDefault:
    "relative w-full max-w-xl max-h-[min(calc(100dvh-2rem),52rem)] overflow-hidden border border-line bg-surface-raised shadow-elevation-3 rounded-lg",
  bodyBase:
    "dialog-body min-h-0 flex-1 flex flex-col overflow-y-auto [--dialog-pad:0px]",
  // No bottom padding: a dialog with an action row pins it to the bottom edge (see `.dialog-body`
  // in globals.css); one without gets the bottom padding back from the same stylesheet.
  bodyPadding:
    "px-5 sm:px-8 gap-6 sm:gap-7 [--dialog-pad:1.25rem] sm:[--dialog-pad:2rem]",
  header: "flex flex-col space-y-1.5 text-center sm:text-left",
  footer: "dialog-footer",
  title: "text-[1.375rem] font-semibold leading-tight tracking-tight",
  description: "text-body-sm text-ink-muted",
} as const;
