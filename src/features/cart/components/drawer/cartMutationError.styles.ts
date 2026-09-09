import { cn } from "@/shared/utils/dom/cn";

export const cartMutationErrorStyles = {
  root: (extraClassName?: string) =>
    cn(
      "flex items-start gap-2 border border-danger/30 bg-danger-subtle px-3 py-2.5 text-body-sm text-danger",
      extraClassName,
    ),
  icon: "mt-0.5 h-4 w-4 shrink-0",
  message: "min-w-0 flex-1 leading-relaxed",
  dismissButton:
    "h-7 min-h-7 max-h-7 w-7 shrink-0 p-0 text-danger hover:bg-danger/10 hover:text-danger",
  dismissIcon: "h-3.5 w-3.5",
} as const;
