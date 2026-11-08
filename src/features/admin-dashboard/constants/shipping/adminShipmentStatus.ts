import { LABELS } from "@/shared/constants/labels";
import type { AdminShipmentStatus } from "../../api/shipping/shipping.api";

/** Where an admin may move a shipment from each status (mirrors backend `SHIPMENT_STATUS_TRANSITIONS`). */
export const ADMIN_SHIPMENT_NEXT_STATUSES: Record<
  string,
  readonly AdminShipmentStatus[]
> = {
  PENDING: ["IN_TRANSIT", "OUT_FOR_DELIVERY", "DELIVERED", "FAILED"],
  PICKED_UP: [
    "IN_TRANSIT",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "FAILED",
    "RTO_INITIATED",
  ],
  IN_TRANSIT: ["OUT_FOR_DELIVERY", "DELIVERED", "FAILED", "RTO_INITIATED"],
  OUT_FOR_DELIVERY: ["DELIVERED", "FAILED", "RTO_INITIATED"],
  FAILED: ["IN_TRANSIT", "OUT_FOR_DELIVERY", "RTO_INITIATED"],
  RTO_INITIATED: ["RTO_DELIVERED"],
};

export const ADMIN_SHIPMENT_STATUS_LABELS: Record<AdminShipmentStatus, string> =
  {
    IN_TRANSIT: LABELS.shipmentStatusInTransit,
    OUT_FOR_DELIVERY: LABELS.shipmentStatusOutForDelivery,
    DELIVERED: LABELS.shipmentStatusDelivered,
    FAILED: LABELS.shipmentStatusFailed,
    RTO_INITIATED: LABELS.shipmentStatusRtoInitiated,
    RTO_DELIVERED: LABELS.shipmentStatusRtoDelivered,
  };
