/**
 * Named class groups for the coupons page header (Rule 5).
 */
export const couponsPageHeaderStyles = {
  root: "space-y-6",
  headerRow:
    "flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
  heading: "text-[1.25rem] font-semibold text-ink sm:text-[1.375rem]",
  dialog: "max-h-[min(92vh,48rem)] max-w-2xl overflow-y-auto",
  form: "space-y-1",
  batchesSection: "space-y-3",
  batchesHeading: "text-[1rem] font-semibold text-ink",
} as const;
