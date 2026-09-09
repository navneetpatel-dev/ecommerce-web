import type { Address } from "@/shared/api/types";

export function formatAddress(address: Address | null | undefined): string {
  if (!address) return "Address unavailable";
  return [
    address.line1,
    address.line2,
    address.city,
    address.state,
    address.pincode,
  ]
    .filter(Boolean)
    .join(", ");
}
