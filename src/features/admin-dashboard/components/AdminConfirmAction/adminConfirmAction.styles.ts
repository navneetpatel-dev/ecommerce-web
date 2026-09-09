import { cn } from "@/shared/utils/cn";
import {
  tableMenuButtonClass,
  type TableActionTone,
} from "@/shared/constants/tableActionTone";
import type { AdminActionTone } from "../../utils/adminActionTone";

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
