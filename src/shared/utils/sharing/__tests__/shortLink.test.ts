import { describe, expect, it } from "vitest";
import { safeRedirectPath, toInlineScriptString } from "../shortLink";

const OFF_SITE = [
  "//evil.com",
  "//evil.com/path",
  "///evil.com",
  "/\\evil.com",
  "\\\\evil.com",
  "/\\/evil.com",
  "javascript:alert(1)",
  "JaVaScRiPt:alert(1)",
  "data:text/html,<script>alert(1)</script>",
  "https://evil.com",
  "/\t/evil.com",
  "/\n/evil.com",
  "",
  "   ",
  "x".repeat(5000),
];

describe("safeRedirectPath", () => {
  it.each(OFF_SITE.map((v) => [v.slice(0, 40), v]))(
    "never leaves the site: %j",
    (_label, input) => {
      const out = safeRedirectPath(input);
      expect(out.startsWith("/")).toBe(true);
      expect(out.startsWith("//")).toBe(false);
      expect(out).not.toMatch(/[\\<>"]/);
    },
  );

  it("collapses the open-redirect payloads to the home page", () => {
    for (const input of ["//evil.com", "/\\evil.com", "///evil.com", ""]) {
      expect(safeRedirectPath(input)).toBe("/");
    }
    expect(safeRedirectPath(null)).toBe("/");
    expect(safeRedirectPath(undefined)).toBe("/");
  });

  it("keeps ordinary same-site paths and queries", () => {
    expect(safeRedirectPath("/products/blue-shirt")).toBe(
      "/products/blue-shirt",
    );
    expect(safeRedirectPath("/category/men?sort=price&page=2")).toBe(
      "/category/men?sort=price&page=2",
    );
    expect(safeRedirectPath("products/blue-shirt")).toBe(
      "/products/blue-shirt",
    );
  });

  it("percent-encodes markup so it cannot break out of an inline script", () => {
    const out = safeRedirectPath("/</script><script>alert(1)</script>");
    expect(out).toBe("/%3C/script%3E%3Cscript%3Ealert(1)%3C/script%3E");
    expect(out).not.toMatch(/[<>]/);
  });
});

describe("toInlineScriptString", () => {
  const evaluate = (literal: string) => new Function(`return ${literal};`)();

  it("round-trips any string", () => {
    for (const value of [
      "/products/x",
      '/a"b',
      "/a'b",
      "/a\\b",
      "</script><script>alert(1)</script>",
      "<!--",
      "a&b",
      `line${String.fromCharCode(0x2028)}sep${String.fromCharCode(0x2029)}`,
    ]) {
      expect(evaluate(toInlineScriptString(value))).toBe(value);
    }
  });

  it("never contains a sequence that can end or open a script element", () => {
    const out = toInlineScriptString("</script><script>alert(1)</script><!--");
    expect(out).not.toMatch(/<|>/);
    expect(out.toLowerCase()).not.toContain("</script");
    expect(out).not.toContain(String.fromCharCode(0x2028));
  });
});
