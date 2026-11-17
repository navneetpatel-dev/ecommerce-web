/**
 * Converts SCREAMING_SNAKE_CASE enum values (e.g. "PENDING_APPROVAL", "OUT_FOR_DELIVERY")
 * into human-readable Title Case labels (e.g. "Pending Approval", "Out For Delivery").
 */
export function formatStatusLabel(status: string): string {
  if (!status) return "";
  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
