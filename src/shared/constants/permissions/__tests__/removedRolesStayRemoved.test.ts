// @vitest-environment node
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { ROLE_VALUES } from "@/shared/constants/labels";

/** The platform has three roles: nothing in the app may name the roles or features taken out. */
const SRC = path.resolve(__dirname, "../../../..");
const REMOVED =
  /VENDOR_STAFF|ADMIN_(ORDER|CATALOG|FINANCE)_MANAGER|["'](team\.manage|role\.manage|coupon\.unlimited|analytics\.revenue)["']|\/me\/staff|\/admin\/roles|\/vendor\/dashboard\/team/;

function files(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory())
      return entry.name === "__tests__" ? [] : files(full);
    return /\.(ts|tsx)$/.test(entry.name) ? [full] : [];
  });
}

describe("removed roles stay removed", () => {
  it("has exactly Super Admin, Vendor and Customer", () => {
    expect([...ROLE_VALUES].sort()).toEqual([
      "CUSTOMER",
      "SUPER_ADMIN",
      "VENDOR_OWNER",
    ]);
  });

  it("no source file names a removed role, permission or page", () => {
    const offenders = files(SRC).flatMap((file) =>
      readFileSync(file, "utf8")
        .split("\n")
        .flatMap((line, index) =>
          REMOVED.test(line)
            ? [`${path.relative(SRC, file)}:${index + 1} ${line.trim()}`]
            : [],
        ),
    );
    expect(offenders).toEqual([]);
  });
});
