import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

const fetchShortLink = vi.fn();

vi.mock("@/shared/utils/sharing/shortLink", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/shared/utils/sharing/shortLink")>();
  return { ...actual, fetchShortLink: (code: string) => fetchShortLink(code) };
});
vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NOT_FOUND");
  },
}));

import ShortLinkRedirectPage from "../page";

async function render(targetUrl: string) {
  fetchShortLink.mockResolvedValue({
    code: "abc",
    targetUrl,
    shortUrl: "https://shop.example/s/abc",
    resourceType: "PRODUCT",
    metadata: { name: "Shirt", price: 100 },
  });
  const element = await ShortLinkRedirectPage({
    params: Promise.resolve({ code: "abc" }),
  });
  return renderToStaticMarkup(element);
}

/** The inline redirect script's body, i.e. what the browser would execute. */
const inlineScripts = (html: string) =>
  [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]!);

describe("short-link redirect page", () => {
  beforeEach(() => fetchShortLink.mockReset());

  it("redirects to a normal product path", async () => {
    const html = await render("/products/blue-shirt");
    expect(inlineScripts(html)).toEqual([
      'window.location.replace("/products/blue-shirt");',
    ]);
  });

  it.each(["//evil.com", "/\\evil.com", "///evil.com"])(
    "regression: a poisoned target %j never leaves the site",
    async (evil) => {
      const html = await render(evil);
      const [script] = inlineScripts(html);
      expect(script).toBe('window.location.replace("/");');
      expect(html).not.toContain("evil.com");
    },
  );

  it("a javascript: target is only ever read as a same-site path, never as a script URL", async () => {
    const html = await render("javascript:alert(1)");
    const [script] = inlineScripts(html);
    expect(script).toBe('window.location.replace("/javascript:alert(1)");');
    expect(script).not.toContain('replace("javascript');
  });

  it("regression: markup in the target cannot close the script and inject another", async () => {
    const html = await render("/</script><script>alert(1)</script>");
    const scripts = inlineScripts(html);
    expect(scripts).toHaveLength(1);
    expect(scripts[0]).not.toContain("alert(1)</script");
    expect(html.match(/<script/g)).toHaveLength(1);
    expect(html).not.toMatch(/<script>alert\(1\)/);
  });
});
