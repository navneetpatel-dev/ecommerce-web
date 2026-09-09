export const tableStyles = {
  container: "scrollbar-none relative w-full overflow-auto",
  table: "w-full min-w-max caption-bottom text-body-sm",
  header:
    "[&_tr]:bg-[color-mix(in_srgb,var(--paper)_70%,var(--surface))] [&_tr:hover]:bg-[color-mix(in_srgb,var(--paper)_70%,var(--surface))]",
  body: "[&_tr:last-child_td]:border-b-0",
  row: "group bg-surface transition-colors hover:bg-[color-mix(in_srgb,var(--brand-subtle)_40%,var(--surface))] focus-within:bg-[color-mix(in_srgb,var(--brand-subtle)_40%,var(--surface))]",
  head: "h-11 border-b border-line px-4 text-left align-middle font-medium text-ink-muted has-[[role=checkbox]]:pr-0",
  cell: "border-b border-line p-4 align-middle has-[[role=checkbox]]:pr-0",
} as const;
