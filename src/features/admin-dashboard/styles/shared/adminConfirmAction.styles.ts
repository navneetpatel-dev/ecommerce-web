import { cn } from "@/shared/utils/dom/cn";
import {
  tableMenuButtonClass,
  type TableActionTone,
} from "@/shared/constants/table/tableActionTone";
import type { AdminActionTone } from "../../utils/shared/adminActionTone";

const inlineToneClass: Record<string, string> = {
  danger: cn(
    "border border-danger/35 bg-danger-subtle text-danger shadow-xs",
    "hover:border-danger hover:bg-danger hover:text-paper",
    "focus-visible:outline-danger transition-all font-semibold rounded-lg",
  ),
  success: cn(
    "border border-success/35 bg-success-subtle text-success shadow-xs",
    "hover:border-success hover:bg-success hover:text-paper",
    "focus-visible:outline-success transition-all font-semibold rounded-lg",
  ),
  neutral: cn(
    "border border-line-strong/80 bg-surface text-ink shadow-xs",
    "hover:border-ink hover:bg-ink hover:text-paper",
    "transition-all font-medium rounded-lg",
  ),
  edit: cn(
    "border border-brand/35 bg-brand-subtle text-brand shadow-xs",
    "hover:border-brand hover:bg-brand hover:text-paper",
    "transition-all font-medium rounded-lg",
  ),
  archive: cn(
    "border border-warning/35 bg-warning-subtle text-warning shadow-xs",
    "hover:border-warning hover:bg-warning hover:text-paper",
    "transition-all font-medium rounded-lg",
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
