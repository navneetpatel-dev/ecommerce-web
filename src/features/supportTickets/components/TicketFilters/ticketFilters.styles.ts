import { cn } from "@/shared/utils/cn";

export const ticketFiltersStyles = {
  container: (showVendorId: boolean) =>
    cn(
      "grid gap-3 border border-line bg-surface-raised p-4 sm:grid-cols-2",
      showVendorId ? "lg:grid-cols-4" : "lg:grid-cols-3",
    ),
} as const;
