import { cn } from "@/shared/utils/cn";

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
    "border-transparent bg-transparent text-danger shadow-none",
    "hover:border-transparent hover:bg-danger hover:text-paper",
    "gap-1.5 px-3 font-medium tracking-wide",
    "[&_svg]:!size-3.5 [&_svg]:shrink-0",
  ),
  success: cn(
    "border-transparent bg-transparent text-brand shadow-none",
    "hover:border-transparent hover:bg-brand hover:text-paper",
    "gap-1.5 px-3 font-medium tracking-wide",
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
