export type OrderShipmentSummary = {
  id: string;
  vendorName: string;
  status: string;
  trackingNumber: string | null;
  proofOfDeliveryUrl: string | null;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function vendorNameFrom(value: unknown): string {
  const vendor = asRecord(value);
  const businessName = vendor?.businessName;
  if (typeof businessName === "string" && businessName.trim()) return businessName;
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
    typeof shipment?.trackingNumber === "string" ? shipment.trackingNumber : null;
  const proofOfDeliveryUrl =
    typeof shipment?.proofOfDeliveryUrl === "string"
      ? shipment.proofOfDeliveryUrl
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
    proofOfDeliveryUrl,
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
