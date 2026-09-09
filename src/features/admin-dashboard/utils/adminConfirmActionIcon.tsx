import { Archive, Check, Trash2, Ban, Play } from "lucide-react";
import type { StatusDialogVariant } from "@/shared/components/StatusDialog.component";
import type { AdminActionTone } from "./adminActionTone";

export function renderToneIcon(tone: AdminActionTone) {
  switch (tone) {
    case "archive":
      return <Archive strokeWidth={2.25} aria-hidden />;
    case "danger":
      return <Trash2 strokeWidth={2.25} aria-hidden />;
    case "success":
      return <Check strokeWidth={2.25} aria-hidden />;
    case "neutral":
      return <Ban strokeWidth={2.25} aria-hidden />;
    default:
      return <Play strokeWidth={2.25} aria-hidden />;
  }
}

export function toneFromDialog(variant: StatusDialogVariant): AdminActionTone {
  if (variant === "danger") return "danger";
  if (variant === "success") return "success";
  /** Warning is used for archive, suspend, block — callers should pass `tone` when not archive. */
  if (variant === "warning") return "archive";
  return "neutral";
}
