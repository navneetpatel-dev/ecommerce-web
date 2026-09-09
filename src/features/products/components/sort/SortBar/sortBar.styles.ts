import { cn } from "@/shared/utils/dom/cn";

export const sortBarStyles = {
  root: (className?: string) =>
    cn(
      "mb-6 flex flex-wrap items-center justify-between gap-2 border-b border-line pb-4 sm:gap-3",
      className,
    ),
  countText: "text-body-sm tracking-wide text-ink-muted tabular-nums",
  actionsWrapper: "flex items-center gap-2",
  selectTrigger: (hideSortOnMobile: boolean) =>
    cn(
      "w-[11.5rem] rounded-md text-body-sm sm:text-[0.875rem]",
      hideSortOnMobile && "hidden xl:flex",
    ),
  compareButton: "hidden gap-1.5 xl:inline-flex",
} as const;
