import { cn } from "@/shared/utils/cn";

export const categoriesTableStyles = {
  sortableHandle: cn(
    "h-auto min-h-0 max-h-none w-auto cursor-grab touch-none px-0",
    "text-ink-faint hover:bg-transparent hover:text-ink active:cursor-grabbing",
  ),
  gripIcon: "h-4 w-4",
  hint: "mb-2 text-body-sm text-ink-muted",
  error: "mb-2 text-body-sm text-danger",
  nameColumn: "font-medium",
  slugColumn: "text-ink-muted font-mono text-body-sm",
  dragColWidth: "w-10",
  imageColWidth: "w-14",
} as const;
