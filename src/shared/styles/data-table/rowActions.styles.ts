import { HOVER_ON_SURFACE_ROW } from "../interaction.styles";

const itemBase = [
  "w-full cursor-pointer touch-manipulation border border-transparent font-medium text-ink",
  "transition-colors outline-none",
  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand",
  "disabled:pointer-events-none disabled:opacity-50",
  "[&>svg]:size-4 [&>svg]:shrink-0",
].join(" ");

/** The row ⋮ menu: View / Edit tiles on top, then a plain list with destructive actions last. */
export const rowActionsStyles = {
  panel:
    "z-[80] w-[14.5rem] max-w-[calc(100vw-1.5rem)] max-h-[var(--radix-popover-content-available-height)] overflow-y-auto rounded-[12px] border border-line/70 bg-surface-raised p-1.5 shadow-elevation-3",
  tiles: "grid grid-cols-2 gap-1.5",
  tilesSingle: "grid grid-cols-1",
  tile: `${itemBase} flex h-[60px] flex-col items-center justify-center gap-1 rounded-[8px] bg-ink/[0.05] px-1 text-center text-body-sm leading-tight hover:border-brand hover:text-brand`,
  divider: "my-1.5 h-px bg-line/70",
  list: "flex flex-col gap-0.5",
  row: `${itemBase} flex min-h-9 items-center gap-2.5 rounded-[7px] px-2.5 py-1.5 text-left text-body-sm leading-snug pointer-coarse:min-h-11 ${HOVER_ON_SURFACE_ROW} [&>svg]:text-ink-muted`,
  rowDanger:
    "text-danger hover:bg-danger-subtle [&>svg]:text-danger focus-visible:outline-danger",
  spinner: "animate-spin motion-reduce:animate-none",
  empty: "px-2.5 py-2 text-body-sm text-ink-muted",
  status: "sr-only",
} as const;
