import { afterEach, describe, expect, it, vi } from "vitest";
import { getCategoryPaths, getLiveVendorSlugs } from "../sitemapData";

function mockApi(payload: unknown, ok = true) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok,
      json: async () => ({ success: ok, data: payload }),
    }),
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

/**
 * Sitemap URLs are built from these paths: a bare slug list would emit
 * `/category/sarees` for a nested category whose real URL is
 * `/category/clothing/sarees`, i.e. a sitemap full of redirects.
 */
describe("getCategoryPaths", () => {
  it("returns the full slug chain for nested categories", async () => {
    mockApi([
      {
        id: "1",
        name: "Clothing",
        slug: "clothing",
        parentId: null,
        children: [
          { id: "2", name: "Sarees", slug: "sarees", parentId: "1" },
          {
            id: "3",
            name: "Kurta",
            slug: "kurta",
            parentId: "1",
            children: [
              {
                id: "4",
                name: "Silk kurta",
                slug: "silk-kurta",
                parentId: "3",
              },
            ],
          },
        ],
      },
      { id: "5", name: "Home", slug: "home", parentId: null },
    ]);

    await expect(getCategoryPaths()).resolves.toEqual([
      ["clothing"],
      ["clothing", "sarees"],
      ["clothing", "kurta"],
      ["clothing", "kurta", "silk-kurta"],
      ["home"],
    ]);
  });

  it("degrades to an empty list when the catalog is unreachable", async () => {
    mockApi(null, false);

    await expect(getCategoryPaths()).resolves.toEqual([]);
  });
});

describe("getLiveVendorSlugs", () => {
  it("stops after a short page instead of looping forever", async () => {
    mockApi({ items: [{ slug: "loom-co" }, { slug: "kala-store" }] });

    await expect(getLiveVendorSlugs()).resolves.toEqual([
      "loom-co",
      "kala-store",
    ]);
    expect(vi.mocked(fetch)).toHaveBeenCalledTimes(1);
  });

  it("degrades to an empty list when vendors are unreachable", async () => {
    mockApi(null, false);

    await expect(getLiveVendorSlugs()).resolves.toEqual([]);
  });
});
