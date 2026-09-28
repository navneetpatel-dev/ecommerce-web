/** One removable applied-filter chip (bound handler lives in the hook). */
export interface AppliedFilterChip {
  id: string;
  label: string;
  /** Bound in the hook, passed by reference — components never build handlers. */
  onRemove: () => void;
}
