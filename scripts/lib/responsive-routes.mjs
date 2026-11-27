/** Which pages exist and which sign-in opens them. */
import { readdirSync } from "node:fs";
import path from "node:path";

export function listRoutes(appDir) {
  const routes = [];
  const walk = (dir, segments) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        if (entry.name.startsWith("_")) continue;
        const hidden = /^\(.*\)$/.test(entry.name);
        walk(
          path.join(dir, entry.name),
          hidden ? segments : [...segments, entry.name],
        );
      } else if (entry.name === "page.tsx") {
        routes.push("/" + segments.join("/"));
      }
    }
  };
  walk(appDir, []);
  return routes.sort();
}

const CUSTOMER =
  /^\/(cart|checkout|orders|my-returns|returns|profile|wallet|wishlist|reviews|questions|support|gift-cards\/mine)(\/|$)/;

export function roleFor(route) {
  if (route.startsWith("/admin")) return "admin";
  if (route.startsWith("/vendor/dashboard")) return "vendor";
  if (CUSTOMER.test(route)) return "customer";
  return "guest";
}

/** Fills `[id]` / `[slug]` from links and API data seen on the parent list page. */
export function resolveDynamic(route, seen) {
  const index = route.indexOf("/[");
  if (index < 0) return route;
  const parent = route.slice(0, index) || "/";
  const rest = route.slice(index).replace(/^\/\[[^\]]+\]/, "");
  if (route.startsWith("/category/")) {
    return seen.links.find((href) => href.startsWith("/category/")) ?? null;
  }
  const link = seen.links.find(
    (href) =>
      href.startsWith(parent + "/") &&
      !/\/(new|mine|tracking|confirmation|write|redeem)(\/|$)/.test(href),
  );
  const fromLink = link?.slice(parent.length + 1).split(/[/?#]/)[0];
  const key = route.includes("[slug]") ? "slug" : "id";
  const value = fromLink ?? seen.records[parent]?.[key];
  return value ? `${parent}/${value}${rest}` : null;
}
