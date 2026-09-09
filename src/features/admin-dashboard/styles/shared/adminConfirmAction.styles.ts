import { cn } from "@/shared/utils/dom/cn";
import {
  tableMenuButtonClass,
  type TableActionTone,
} from "@/shared/constants/table/tableActionTone";
import type { AdminActionTone } from "../../utils/shared/adminActionTone";

export const adminConfirmActionStyles = {
  triggerButton: (
    resolvedTone: AdminActionTone,
    inline?: boolean,
    triggerClassName?: string,
  ) =>
    cn(
      "select-none cursor-pointer",
      inline
        ? "w-auto gap-1.5"
        : tableMenuButtonClass(resolvedTone as TableActionTone),
      triggerClassName,
    ),
  reasonTextarea: "min-h-[6.5rem] resize-none",
  errorMessage: "text-body-sm text-danger",
} as const;
