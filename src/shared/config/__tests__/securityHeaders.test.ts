import { describe, expect, it } from "vitest";
import nextConfig from "../../../../next.config.mjs";

type Header = { key: string; value: string };
type HeaderRule = { source: string; headers: Header[] };

/** `headers()` is optional on NextConfig, so narrow it once for every test. */
async function readHeaderRules(): Promise<HeaderRule[]> {
  const rules = (await nextConfig.headers?.()) as HeaderRule[] | undefined;
  if (!rules) throw new Error("next.config.mjs no longer declares headers()");
  return rules;
}

/**
 * These are the hardening headers the app ships. They are asserted because
 * nothing else in the toolchain notices when one is dropped — a missing
 * `nosniff` or HSTS fails silently in production.
 */
describe("security headers", () => {
  it("applies them to every route", async () => {
    const rules = await readHeaderRules();
    const [rule] = rules;

    expect(rule.source).toBe("/:path*");
    const headers = new Map(rule.headers.map(({ key, value }) => [key, value]));

    expect(headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(headers.get("X-Frame-Options")).toBe("DENY");
    expect(headers.get("Referrer-Policy")).toBe(
      "strict-origin-when-cross-origin",
    );
    expect(headers.get("Strict-Transport-Security")).toContain("max-age=");
  });

  it("keeps geolocation available to the app itself and blocks the camera", async () => {
    const [rule] = await readHeaderRules();
    const policy = rule.headers.find(
      ({ key }) => key === "Permissions-Policy",
    )?.value;

    // Address forms capture the customer's location; blocking it here would
    // break that with no visible cause. Nothing uses the camera.
    expect(policy).toContain("camera=()");
    expect(policy).toContain("geolocation=(self)");
    expect(policy).toContain("microphone=()");
  });
});
