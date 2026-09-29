#!/usr/bin/env node
/**
 * Prebuild guard for production deploys.
 *
 * Every required public var has a development fallback — `localhost:9000` for
 * the `/api` rewrite and the socket origin, `localhost:5173` for `SITE_URL` —
 * so a deploy that forgets one looks like a broken backend (timeouts, and
 * canonicals/sitemap/robots pointing at localhost) instead of an obvious
 * configuration error.
 *
 * This lives in a script rather than in `next.config.mjs` because Next
 * evaluates the config file *before* it reads `.env*`: a check there sees every
 * var as missing and fails a perfectly good build.
 */
import { pathToFileURL } from "node:url";
import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;

const REQUIRED_PRODUCTION_ENV = ["NEXT_PUBLIC_API_URL", "NEXT_PUBLIC_SITE_URL"];

/** Origins that must never reach a production build's canonicals or sockets. */
const LOCALHOST_ORIGIN =
  /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:|\/|$)/i;

/**
 * `NEXT_PUBLIC_API_URL` is allowed to be empty — that is the documented
 * same-origin mode where the browser calls `/api/*` and Next rewrites it — but
 * it has to be *set*, so a deploy that never mentions it fails here instead of
 * silently proxying to localhost:9000.
 */
const ALLOW_EMPTY = new Set(["NEXT_PUBLIC_API_URL"]);

/** @param {Record<string, string | undefined>} env */
export function missingProductionEnv(env = process.env) {
  if (env.NODE_ENV !== "production") return [];
  return REQUIRED_PRODUCTION_ENV.filter((key) => {
    const value = env[key];
    if (value === undefined) return true;
    return !ALLOW_EMPTY.has(key) && value.trim() === "";
  });
}

/**
 * Set, but still pointing at the developer's machine. These are warnings, not
 * failures: a local production build is legitimate, but a deploy that ships
 * them writes localhost canonicals into the sitemap and robots.txt.
 * @param {Record<string, string | undefined>} env
 */
export function localhostProductionEnv(env = process.env) {
  if (env.NODE_ENV !== "production") return [];
  return REQUIRED_PRODUCTION_ENV.filter((key) => {
    const value = env[key]?.trim();
    return Boolean(value) && LOCALHOST_ORIGIN.test(value);
  });
}

/** @param {Record<string, string | undefined>} env */
export function assertProductionEnv(env = process.env) {
  const missing = missingProductionEnv(env);
  if (missing.length === 0) return;

  throw new Error(
    `Missing required production env: ${missing.join(", ")}. Without them the ` +
      "app proxies /api to localhost:9000, connects sockets to localhost, and " +
      "writes http://localhost:5173 into canonicals, the sitemap and robots.txt.",
  );
}

// Only when run as a script, so importing this module in tests has no effect.
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  loadEnvConfig(process.cwd());
  assertProductionEnv();

  const localhost = localhostProductionEnv();
  if (localhost.length > 0) {
    console.warn(
      `Warning: production build still points at localhost: ${localhost.join(", ")}. ` +
        "Fine for a local smoke test; a real deploy must use public origins " +
        "(canonicals, sitemap, robots and sockets read these values).",
    );
  } else {
    console.log(
      "Production env OK (NEXT_PUBLIC_API_URL, NEXT_PUBLIC_SITE_URL).",
    );
  }
}
