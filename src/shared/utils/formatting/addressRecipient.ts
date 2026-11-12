import type { Address } from "@/shared/api/types";

/** "Asha Rao · 9876543210" for an address card, or null when neither is stored (B-37). */
export function formatAddressRecipient(
  address: Pick<Address, "recipientName" | "recipientPhone">,
): string | null {
  const parts = [address.recipientName, address.recipientPhone]
    .map((part) => part?.trim())
    .filter(Boolean);
  return parts.length ? parts.join(" · ") : null;
}
