export type OrderShipmentSummary = {
  id: string;
  vendorName: string;
  status: string;
  trackingNumber: string | null;
  /** The parcel's own id, once the part has shipped. */
  shipmentId: string | null;
  /** Cash on delivery: marking it delivered must say whether the cash was collected. */
  isCashOnDelivery: boolean;
  /** Card refund for a cancelled or RTO'd part, and where it stands. */
  refundAmount: number | null;
  refundStatus: string | null;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function vendorNameFrom(value: unknown): string {
  const vendor = asRecord(value);
  const businessName = vendor?.businessName;
  if (typeof businessName === "string" && businessName.trim())
    return businessName;
  const name = vendor?.name;
  if (typeof name === "string" && name.trim()) return name;
  return "";
}

function shipmentFrom(value: unknown): Record<string, unknown> | null {
  return asRecord(value);
}

export function mapSubOrderToShipmentSummary(
  value: unknown,
): OrderShipmentSummary | null {
  const subOrder = asRecord(value);
  if (!subOrder || typeof subOrder.id !== "string") return null;
  const shipment = shipmentFrom(subOrder.shipment);
  const trackingNumber =
    typeof shipment?.trackingNumber === "string"
      ? shipment.trackingNumber
      : null;
  const shipmentStatus =
    typeof shipment?.status === "string" ? shipment.status : null;
  const subOrderStatus =
    typeof subOrder.status === "string" ? subOrder.status : "";

  return {
    id: subOrder.id,
    vendorName: vendorNameFrom(subOrder.vendor),
    status: shipmentStatus || subOrderStatus,
    trackingNumber,
    shipmentId: typeof shipment?.id === "string" ? shipment.id : null,
    isCashOnDelivery: shipment?.codAmount != null,
    refundAmount:
      typeof subOrder.cancelRefundAmount === "number"
        ? subOrder.cancelRefundAmount
        : null,
    refundStatus:
      typeof subOrder.cancelRefundStatus === "string"
        ? subOrder.cancelRefundStatus
        : null,
  };
}

export function mapSubOrdersToShipmentSummaries(
  value: unknown,
): OrderShipmentSummary[] {
  if (!Array.isArray(value)) return [];
  return value
    .map(mapSubOrderToShipmentSummary)
    .filter((row): row is OrderShipmentSummary => row !== null);
}
