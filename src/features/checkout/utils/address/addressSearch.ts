import type { Address } from "@/shared/api/types";

/** Search appears once a shopper has more addresses than fit at a glance (C-15). */
export const ADDRESS_SEARCH_THRESHOLD = 5;

/** Default address first, then the rest in their saved order. */
export function sortDefaultFirst(addresses: Address[]): Address[] {
  return [...addresses].sort(
    (a, b) => Number(b.isDefault) - Number(a.isDefault),
  );
}

/** Matches the recipient's name, the street, the city or the PIN code. */
export function filterAddresses(addresses: Address[], term: string): Address[] {
  const needle = term.trim().toLowerCase();
  const ordered = sortDefaultFirst(addresses);
  if (!needle) return ordered;
  return ordered.filter((address) =>
    [
      address.recipientName,
      address.line1,
      address.line2,
      address.city,
      address.pincode,
    ]
      .filter(Boolean)
      .some((field) => String(field).toLowerCase().includes(needle)),
  );
}
