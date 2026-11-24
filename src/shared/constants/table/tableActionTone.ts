import { cn } from "@/shared/utils/dom/cn";

/** Layout for labeled buttons inside table row kebab menus. */
export const TABLE_ROW_MENU_BUTTON_LAYOUT = cn(
  "h-8 min-h-8 max-h-8 w-full min-w-0 justify-start overflow-visible rounded-none!",
  "text-body-sm font-medium leading-none",
);

/** Borderless semantic action styles for table row kebab menus. */
export const tableActionTone = {
  edit: cn(
    "border-transparent bg-transparent text-ink shadow-none",
    "hover:border-transparent hover:bg-brand hover:text-paper",
    "gap-1.5 px-3 font-medium tracking-wide",
    "[&_svg]:!size-3.5 [&_svg]:shrink-0",
  ),
  archive: cn(
    "border-transparent bg-transparent text-warning shadow-none",
    "hover:border-transparent hover:bg-warning hover:text-paper",
    "gap-1.5 px-3 font-medium tracking-wide",
    "[&_svg]:!size-3.5 [&_svg]:shrink-0",
  ),
  danger: cn(
    "border border-rose-200/70 bg-rose-50/70 text-rose-700 shadow-none dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300",
    "hover:border-rose-600 hover:bg-rose-600 hover:text-white dark:hover:border-rose-600 dark:hover:bg-rose-600 dark:hover:text-white",
    "gap-1.5 px-3 font-semibold tracking-wide transition-all rounded-md",
    "[&_svg]:!size-3.5 [&_svg]:shrink-0",
  ),
  success: cn(
    "border border-emerald-200/70 bg-emerald-50/70 text-emerald-700 shadow-none dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300",
    "hover:border-emerald-600 hover:bg-emerald-600 hover:text-white dark:hover:border-emerald-600 dark:hover:bg-emerald-600 dark:hover:text-white",
    "gap-1.5 px-3 font-semibold tracking-wide transition-all rounded-md",
    "[&_svg]:!size-3.5 [&_svg]:shrink-0",
  ),
  neutral: cn(
    "border-transparent bg-transparent text-ink shadow-none",
    "hover:border-transparent hover:bg-ink hover:text-paper",
    "gap-1.5 px-3 font-medium tracking-wide",
    "[&_svg]:!size-3.5 [&_svg]:shrink-0",
  ),
} as const;

export type TableActionTone = keyof typeof tableActionTone;

export function tableMenuButtonClass(tone: TableActionTone) {
  return cn(TABLE_ROW_MENU_BUTTON_LAYOUT, tableActionTone[tone]);
}
