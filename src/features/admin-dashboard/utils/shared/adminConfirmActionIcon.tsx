import {
  Archive,
  Check,
  Trash2,
  Ban,
  Play,
  type LucideIcon,
} from "lucide-react";
import type { StatusDialogVariant } from "@/shared/components/dialogs/StatusDialog.component";
import type { AdminActionTone } from "./adminActionTone";

/** The icon an action gets when its caller does not name a better one. */
export function toneIcon(tone: AdminActionTone): LucideIcon {
  switch (tone) {
    case "archive":
      return Archive;
    case "danger":
      return Trash2;
    case "success":
      return Check;
    case "neutral":
      return Ban;
    default:
      return Play;
  }
}

export function toneFromDialog(variant: StatusDialogVariant): AdminActionTone {
  if (variant === "danger") return "danger";
  if (variant === "success") return "success";
  /** Warning is used for archive, suspend, block — callers should pass `tone` when not archive. */
  if (variant === "warning") return "archive";
  return "neutral";
}
