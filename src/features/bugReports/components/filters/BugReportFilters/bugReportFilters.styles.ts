import { cn } from "@/shared/utils/dom/cn";

export const bugReportFiltersStyles = {
  container: (isAdmin: boolean) =>
    cn(
      "grid gap-3 border border-line bg-surface-raised p-4 sm:grid-cols-2",
      isAdmin ? "lg:grid-cols-4" : "lg:grid-cols-2",
    ),
} as const;
