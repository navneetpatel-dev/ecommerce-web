import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

/** Decides the colour of the icon and of the confirm button. */
export type StatusDialogVariant = "info" | "success" | "warning" | "danger";

export interface StatusDialogAction {
  label: string;
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  /** Shown on hover when the action is disabled (cursor popover). */
  disabledHint?: string;
}

export interface StatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: ReactNode;
  variant?: StatusDialogVariant;
  /** Match the icon to the action; the default only says how serious it is. */
  icon?: LucideIcon;
  /** The confirm button, in the dialog's colour. */
  primaryAction?: StatusDialogAction;
  /** Usually Cancel. */
  secondaryAction?: StatusDialogAction;
  /** A third, quiet choice shown before the other two. */
  extraAction?: StatusDialogAction;
  /** `wide` is for dialogs that show a summary table. */
  size?: "default" | "wide";
  onCloseAutoFocus?: (event: Event) => void;
  children?: ReactNode;
}
