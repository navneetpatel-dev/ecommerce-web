import { cn } from "@/shared/utils/cn";

export const changeUserRoleDialogStyles = {
  triggerWrapper: "inline-block cursor-pointer",
  dialogContent: "sm:max-w-[425px]",
  title: "flex items-center gap-2",
  titleIcon: "h-5 w-5 text-ink-primary",
  errorAlert: cn(
    "flex items-center gap-2 rounded border border-rose-200 bg-rose-50 p-2.5",
    "text-xs text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400",
  ),
  errorIcon: "h-4 w-4 shrink-0",
  formBody: "space-y-3 py-2",
  label: "text-body-xs font-semibold text-ink-muted",
  loadingText: "text-body-sm text-ink-muted",
  selectInput: cn(
    "w-full rounded border border-line bg-surface p-2",
    "text-body-sm text-ink outline-none focus:border-brand",
  ),
  vendorSection: "space-y-1.5 pt-2",
  footer: "gap-2 sm:gap-0",
} as const;
