/** Shared DataTable presentation limits. */
export const TABLE_CELL_MAX_CHARS = 30

/** Marker class — pinned actions column (sticky right). */
export const TABLE_ACTIONS_PIN_CLASS = 'table-actions-pin'

/**
 * Required for `position: sticky` on `<th>` / `<td>` — `border-collapse: collapse` breaks pinning.
 */
export const TABLE_PINNED_LAYOUT_CLASS = 'border-separate border-spacing-0'

/** Sticky actions column header — pinned on horizontal scroll (lg+ tables). */
export const TABLE_ACTIONS_HEAD_CLASS = [
  TABLE_ACTIONS_PIN_CLASS,
  'sticky right-0 z-[3]',
  'min-w-[4.5rem] w-[4.5rem]',
  'bg-paper px-2 text-right',
  'text-[0.75rem] uppercase tracking-[0.04em]',
  'shadow-none',
].join(' ')

/** Sticky actions column cell — pinned on horizontal scroll (lg+ tables). */
export const TABLE_ACTIONS_CELL_CLASS = [
  TABLE_ACTIONS_PIN_CLASS,
  'sticky right-0 z-[2]',
  'min-w-[4.5rem] w-[4.5rem]',
  'bg-surface px-2 text-right align-middle whitespace-nowrap',
  'group-hover:bg-brand-subtle/25 group-focus-within:bg-brand-subtle/25',
  'shadow-none',
].join(' ')

/** Compact icon-only triggers for table row actions (pairs with Button size="sm"). */
export const TABLE_ACTION_ICON_BUTTON_CLASS = 'h-8 w-8 shrink-0 p-0 [&_svg]:size-4'

/** Outer scroll container for wide dashboard tables (single scrollport). */
export const TABLE_SCROLL_SHELL_CLASS = [
  'relative min-w-0 overflow-x-auto overflow-y-visible',
  'rounded-md border border-line bg-surface',
  'shadow-[0_1px_0_rgba(15,23,42,0.03)]',
  '[-webkit-overflow-scrolling:touch]',
  '[scrollbar-gutter:stable]',
  '[&[data-scrolled=true]_.table-actions-pin]:shadow-[-8px_0_16px_-12px_rgba(15,23,42,0.12)]',
].join(' ')

/** Default classes for horizontally scrollable data cells. */
export const TABLE_DATA_CELL_CLASS = 'whitespace-nowrap'
