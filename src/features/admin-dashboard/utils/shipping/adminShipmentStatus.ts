import type { AdminShipmentStatus } from "../../api/shipping/shipping.api";
import { ADMIN_SHIPMENT_NEXT_STATUSES } from "../../constants/shipping/adminShipmentStatus";

export function nextAdminShipmentStatuses(
  status: string | null | undefined,
): readonly AdminShipmentStatus[] {
  if (!status) return [];
  return ADMIN_SHIPMENT_NEXT_STATUSES[status] ?? [];
}

/** What the backend needs before it will accept a move (null when the move is ready to send). */
export function adminShipmentStatusBlocker(input: {
  nextStatus: AdminShipmentStatus | null;
  reason: string;
}): "chooseStatus" | "reasonRequired" | null {
  if (!input.nextStatus) return "chooseStatus";
  if (input.nextStatus === "FAILED" && !input.reason.trim())
    return "reasonRequired";
  return null;
}
