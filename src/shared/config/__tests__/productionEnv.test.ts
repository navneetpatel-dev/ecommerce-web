import { describe, expect, it } from "vitest";
import {
  assertProductionEnv,
  localhostProductionEnv,
  missingProductionEnv,
} from "../../../../scripts/check-production-env.mjs";

/**
 * Every required public var has a localhost fallback, so a deploy that forgets
 * one looks like a broken backend (timeouts, canonicals on localhost:5173)
 * instead of a config error. The guard turns that into a failed build — it runs
 * from a prebuild script because `next.config.mjs` is evaluated before Next
 * reads `.env*`, where all of these would look missing.
 *
 * `NEXT_PUBLIC_API_URL` is deliberately allowed to be empty: the same-origin
 * proxy mode this repo ships with sets it to "" on purpose, so treating empty as
 * "missing" would fail every correct build.
 */
const production = (env: Record<string, string | undefined>) => ({
  NODE_ENV: "production",
  ...env,
});

describe("assertProductionEnv", () => {
  it("throws when a required var is not set at all", () => {
    expect(() => assertProductionEnv(production({}))).toThrow(
      /NEXT_PUBLIC_API_URL, NEXT_PUBLIC_SITE_URL/,
    );
    expect(
      missingProductionEnv(production({ NEXT_PUBLIC_API_URL: "" })),
    ).toEqual(["NEXT_PUBLIC_SITE_URL"]);
  });

  it("accepts an empty API URL, which selects same-origin proxying", () => {
    expect(() =>
      assertProductionEnv(
        production({
          NEXT_PUBLIC_API_URL: "",
          NEXT_PUBLIC_SITE_URL: "https://shop.test",
        }),
      ),
    ).not.toThrow();
  });

  it("treats a blank site URL as missing, since canonicals need an origin", () => {
    expect(() =>
      assertProductionEnv(
        production({
          NEXT_PUBLIC_API_URL: "",
          NEXT_PUBLIC_SITE_URL: "   ",
        }),
      ),
    ).toThrow(/NEXT_PUBLIC_SITE_URL/);
  });

  it("passes when both are configured", () => {
    expect(() =>
      assertProductionEnv(
        production({
          NEXT_PUBLIC_API_URL: "https://api.shop.test",
          NEXT_PUBLIC_SITE_URL: "https://shop.test",
        }),
      ),
    ).not.toThrow();
  });

  it("stays out of the way for development and test builds", () => {
    expect(() =>
      assertProductionEnv({ NODE_ENV: "development" }),
    ).not.toThrow();
    expect(() => assertProductionEnv({ NODE_ENV: "test" })).not.toThrow();
    expect(missingProductionEnv({ NODE_ENV: "test" })).toEqual([]);
    expect(localhostProductionEnv({ NODE_ENV: "test" })).toEqual([]);
  });
});

describe("localhostProductionEnv", () => {
  it("flags a build whose canonicals would point at the developer's machine", () => {
    expect(
      localhostProductionEnv(
        production({
          NEXT_PUBLIC_API_URL: "",
          NEXT_PUBLIC_SITE_URL: "http://localhost:5173",
        }),
      ),
    ).toEqual(["NEXT_PUBLIC_SITE_URL"]);

    expect(
      localhostProductionEnv(
        production({
          NEXT_PUBLIC_API_URL: "http://127.0.0.1:9000",
          NEXT_PUBLIC_SITE_URL: "https://shop.test",
        }),
      ),
    ).toEqual(["NEXT_PUBLIC_API_URL"]);
  });

  it("accepts public origins, and an empty API URL as no opinion", () => {
    expect(
      localhostProductionEnv(
        production({
          NEXT_PUBLIC_API_URL: "",
          NEXT_PUBLIC_SITE_URL: "https://shop.test",
        }),
      ),
    ).toEqual([]);
  });
});
