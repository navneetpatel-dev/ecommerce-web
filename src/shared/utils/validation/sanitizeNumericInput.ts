/**
 * Normalizes leading zeros in numeric strings (e.g. "01000" -> "1000", "00.5" -> "0.5")
 * while keeping "0", "0.xxx", negative prefixes, and empty strings intact.
 */
export function stripLeadingZeros(raw: string): string {
  if (!raw) return "";
  const negative = raw.startsWith("-");
  const body = negative ? raw.slice(1) : raw;
  if (!body) return raw;
  if (body.includes(".")) {
    const [whole, ...rest] = body.split(".");
    const normalizedWhole = whole === "" ? "" : whole.replace(/^0+(?=\d)/, "");
    return `${negative ? "-" : ""}${normalizedWhole}.${rest.join("")}`;
  }
  const normalized = body.replace(/^0+(?=\d)/, "");
  return `${negative ? "-" : ""}${normalized}`;
}

export function sanitizeNumericText(
  raw: string,
  options: { allowDecimal?: boolean; allowNegative?: boolean } = {},
): string {
  const { allowDecimal = true, allowNegative = false } = options;
  let cleaned = raw;
  if (allowNegative) {
    const neg = cleaned.startsWith("-");
    cleaned = (neg ? "-" : "") + cleaned.replace(/-/g, "");
  } else {
    cleaned = cleaned.replace(/-/g, "");
  }
  cleaned = cleaned.replace(allowDecimal ? /[^0-9.-]/g : /[^0-9-]/g, "");
  if (allowDecimal && cleaned.includes(".")) {
    const [whole, ...decimals] = cleaned.split(".");
    cleaned = `${whole}.${decimals.join("")}`;
  }
  return stripLeadingZeros(cleaned);
}
