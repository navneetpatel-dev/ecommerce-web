import { describe, it } from "vitest";
import assert from "node:assert/strict";
import { ordersKeys } from "../orders.queries";

describe("orders query keys", () => {
  it("builds stable, hierarchical keys", () => {
    assert.deepEqual(ordersKeys.all, ["orders"]);
    assert.deepEqual(ordersKeys.detail("o1"), ["orders", "detail", "o1"]);
    assert.deepEqual(ordersKeys.mine("CUSTOMER", 2), [
      "orders",
      "mine",
      "CUSTOMER",
      2,
    ]);
  });

  it("normalizes an undefined role to null so keys stay cache-stable", () => {
    assert.deepEqual(ordersKeys.mine(undefined, 1), [
      "orders",
      "mine",
      null,
      1,
    ]);
  });
});
