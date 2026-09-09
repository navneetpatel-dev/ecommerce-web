import type { DeliveryPickup } from "../../types/agent/types";

export function pickupTaskTitle(pickup: DeliveryPickup): string {
  return (
    pickup.orderItem?.productName ??
    pickup.productName ??
    `Return ${pickup.id.slice(0, 8)}`
  );
}

export function pickupTaskCitySubtitle(pickup: DeliveryPickup): string {
  return `${pickup.type} · ${pickup.subOrder?.order?.shippingAddress?.city ?? "Address unavailable"}`;
}

export function pickupTaskCustomerSubtitle(pickup: DeliveryPickup): string {
  return `${pickup.type} · ${pickup.user?.name ?? "Customer"}`;
}
