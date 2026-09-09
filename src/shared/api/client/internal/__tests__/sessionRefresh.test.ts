import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { refreshSessionOrThrow } from "../sessionRefresh";

function jsonResponse(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "Content-Type": "application/json" },
    ...init,
  });
}

describe("refreshSessionOrThrow", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("single-flights concurrent refresh calls into one network request", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        jsonResponse({ success: true, data: { accessToken: "new-token" } }),
      );
    vi.stubGlobal("fetch", fetchMock);

    await Promise.all([refreshSessionOrThrow(), refreshSessionOrThrow()]);

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("rejects all in-flight callers when the refresh fails with a definitive auth error", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        jsonResponse(
          { success: false, error: { code: "UNAUTHORIZED", message: "nope" } },
          { status: 401 },
        ),
      );
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      Promise.all([refreshSessionOrThrow(), refreshSessionOrThrow()]),
    ).rejects.toThrow();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
