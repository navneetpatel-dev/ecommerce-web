import type { AriaAttributes, MouseEvent } from "react";
import type { LucideIcon } from "lucide-react";

/** `view` and `edit` become the tiles on top of the row menu; `danger` sorts last, in red. */
export type RowActionKind = "view" | "edit" | "default" | "danger";

/** What an action leaf tells the row menu about itself. */
export interface RowActionEntry {
  id: string;
  label: string;
  icon: LucideIcon;
  kind: RowActionKind;
  disabled: boolean;
  disabledHint?: string;
  loading: boolean;
  attentionClassName?: string;
  ariaLabel?: string;
  ariaHasPopup?: AriaAttributes["aria-haspopup"];
  /** Invisible node left where the leaf rendered; its DOM position orders the menu. */
  marker: Node;
  run: (event: MouseEvent<HTMLButtonElement>) => void;
}

export interface RowActionRegistry {
  upsert: (entry: RowActionEntry) => void;
  remove: (id: string) => void;
  subscribe: (listener: () => void) => () => void;
  getSnapshot: () => RowActionEntry[];
}
