/**
 * Toast presentation (Rule 5): the viewport offset keeps toasts clear of the
 * mobile tab bar and the iOS home indicator on phones.
 */
export const toastStackStyles = {
  viewport: "bottom-[calc(4rem+env(safe-area-inset-bottom,0px))] md:bottom-0",
  item: "flex items-start gap-3 border-l-[3px]",
  variants: {
    success: "border-l-success bg-success-subtle",
    info: "border-l-brand bg-brand-subtle",
    error: "border-l-danger bg-danger-subtle",
  },
  icon: {
    success: "text-success",
    info: "text-brand",
    error: "text-danger",
  },
  iconBase: "mt-0.5 h-4 w-4 shrink-0",
  body: "min-w-0 flex-1 space-y-1",
  title: "text-body font-semibold",
  message: "text-body-sm text-ink-muted",
  action: "mt-1",
} as const;
