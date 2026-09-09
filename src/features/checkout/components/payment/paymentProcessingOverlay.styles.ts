export const PAYMENT_PROCESSING_OVERLAY_STYLES = {
  backdrop:
    "fixed inset-0 z-50 flex items-center justify-center bg-ink/55 px-4 backdrop-blur-[2px]",
  card: "w-full max-w-sm border border-line bg-surface-raised px-6 py-8 text-center shadow-elevation-2",
  spinner: "mx-auto animate-spin text-brand",
  title: "mt-4 font-medium text-ink",
  description: "mt-2 text-body-sm leading-relaxed text-ink-muted",
} as const;
