/**
 * Decodes a JWT's payload without verifying its signature — verification
 * already happened server-side; this only reads claims trusted enough to have
 * been handed back to us (used to detect impersonated sessions).
 */
export function decodeJwtPayload(
  token: string,
): { sub?: string; impersonatedBy?: string } | null {
  try {
    const segment = token.split(".")[1];
    if (!segment) return null;
    const normalized = segment.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(normalized)
        .split("")
        .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, "0")}`)
        .join(""),
    );
    return JSON.parse(json) as { sub?: string; impersonatedBy?: string };
  } catch {
    return null;
  }
}
