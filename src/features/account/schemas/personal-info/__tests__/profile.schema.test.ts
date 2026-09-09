import { describe, it } from "vitest";
import assert from "node:assert/strict";
import { ProfileSchema, PROFILE_NAME_MAX } from "../profile.schema";

describe("ProfileSchema", () => {
  it("accepts a valid name with optional phone", () => {
    const parsed = ProfileSchema.safeParse({ name: "Ada Lovelace" });
    assert.equal(parsed.success, true);
  });

  it("rejects a blank name", () => {
    const parsed = ProfileSchema.safeParse({ name: "   " });
    assert.equal(parsed.success, false);
  });

  it("enforces the name limit", () => {
    const parsed = ProfileSchema.safeParse({
      name: "x".repeat(PROFILE_NAME_MAX + 1),
    });
    assert.equal(parsed.success, false);
  });

  it("trims surrounding whitespace from fields", () => {
    const parsed = ProfileSchema.safeParse({
      name: "  Ada  ",
      phone: " 9900112233 ",
    });
    assert.ok(parsed.success);
    if (parsed.success) {
      assert.equal(parsed.data.name, "Ada");
      assert.equal(parsed.data.phone, "9900112233");
    }
  });
});
