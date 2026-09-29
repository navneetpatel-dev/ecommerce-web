import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchSeoApi, fetchSeoApiEntry } from "../fetchSeoApi";

/**
 * The reason a lookup found nothing decides how the route answers: a genuine
 * miss may 404, an outage must keep rendering. `fetchSeoApi` collapses both
 * into null for sitemaps (which must never fail a build); `fetchSeoApiEntry`
 * keeps them apart for pages.
 */
const respond = (status: number, body?: unknown) =>
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({
      status,
      ok: status >= 200 && status < 300,
      json: async () => body ?? {},
    })),
  );

const fail = () =>
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => {
      throw new Error("ECONNREFUSED");
    }),
  );

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("fetchSeoApiEntry", () => {
  it("reports a found entity with its payload", async () => {
    respond(200, { success: true, data: { slug: "brass-lamp" } });

    await expect(fetchSeoApiEntry("/products/brass-lamp")).resolves.toEqual({
      status: "found",
      data: { slug: "brass-lamp" },
    });
  });

  it("reports a 404 as missing, so the route can answer 404", async () => {
    respond(404);

    await expect(fetchSeoApiEntry("/products/nope")).resolves.toEqual({
      status: "missing",
    });
  });

  it("reports a NOT_FOUND envelope as missing even on a 200", async () => {
    respond(200, {
      success: false,
      error: { code: "NOT_FOUND", message: "no such product" },
    });

    await expect(fetchSeoApiEntry("/products/nope")).resolves.toEqual({
      status: "missing",
    });
  });

  it("reports a 5xx as unavailable, never as missing", async () => {
    respond(503);

    await expect(fetchSeoApiEntry("/products/brass-lamp")).resolves.toEqual({
      status: "unavailable",
    });
  });

  it("reports an unreachable backend as unavailable", async () => {
    fail();

    await expect(fetchSeoApiEntry("/products/brass-lamp")).resolves.toEqual({
      status: "unavailable",
    });
  });

  it("reports an unrecognised failure envelope as unavailable", async () => {
    respond(200, {
      success: false,
      error: { code: "VALIDATION_ERROR", message: "bad slug" },
    });

    await expect(fetchSeoApiEntry("/products/brass-lamp")).resolves.toEqual({
      status: "unavailable",
    });
  });

  it("keeps the sitemap helper collapsing everything to null", async () => {
    respond(404);

    await expect(fetchSeoApi("/products/nope")).resolves.toBeNull();
  });
});
