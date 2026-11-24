import { cn } from "@/shared/utils/dom/cn";
import {
  tableMenuButtonClass,
  type TableActionTone,
} from "@/shared/constants/table/tableActionTone";
import type { AdminActionTone } from "../../utils/shared/adminActionTone";

const inlineToneClass: Record<string, string> = {
  danger: cn(
    "border border-rose-200/80 bg-rose-50/80 text-rose-700 shadow-xs",
    "hover:border-rose-600 hover:bg-rose-600 hover:text-white",
    "dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:border-rose-600 dark:hover:bg-rose-600 dark:hover:text-white",
    "transition-all font-semibold",
  ),
  success: cn(
    "border border-emerald-200/80 bg-emerald-50/80 text-emerald-700 shadow-xs",
    "hover:border-emerald-600 hover:bg-emerald-600 hover:text-white",
    "dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:border-emerald-600 dark:hover:bg-emerald-600 dark:hover:text-white",
    "transition-all font-semibold",
  ),
  neutral: cn(
    "border border-line/80 bg-surface text-ink shadow-xs",
    "hover:border-ink hover:bg-ink hover:text-paper",
    "transition-all font-medium",
  ),
  edit: cn(
    "border border-brand/30 bg-brand/10 text-brand shadow-xs",
    "hover:border-brand hover:bg-brand hover:text-paper",
    "transition-all font-medium",
  ),
  archive: cn(
    "border border-warning/30 bg-warning/10 text-warning shadow-xs",
    "hover:border-warning hover:bg-warning hover:text-paper",
    "transition-all font-medium",
  ),
};

export const adminConfirmActionStyles = {
  triggerButton: (
    resolvedTone: AdminActionTone,
    inline?: boolean,
    triggerClassName?: string,
  ) =>
    cn(
      "select-none cursor-pointer",
      inline
        ? cn(
            "w-auto gap-1.5",
            inlineToneClass[resolvedTone] ?? inlineToneClass.neutral,
          )
        : tableMenuButtonClass(resolvedTone as TableActionTone),
      triggerClassName,
    ),
  reasonTextarea: "min-h-[6.5rem] resize-none",
  errorMessage: "text-body-sm text-danger",
} as const;
