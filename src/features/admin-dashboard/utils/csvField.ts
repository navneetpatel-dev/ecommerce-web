/** Shared comma-separated-list helpers for admin form fields (e.g. shipping zone states/pincode prefixes). */

export function asCsv(value: unknown): string {
  if (Array.isArray(value)) return value.map(String).filter(Boolean).join(", ");
  if (typeof value === "string") return value;
  return "";
}

export function parseCsv(value: string): string[] {
  return value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}
