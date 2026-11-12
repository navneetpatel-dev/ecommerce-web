import { beforeEach, describe, expect, it } from "vitest";
import {
  rememberPendingWishlist,
  takePendingWishlist,
} from "../pendingWishlist";

describe("pending wishlist intent (C-05)", () => {
  beforeEach(() => window.sessionStorage.clear());

  it("is taken once, for the same product", () => {
    rememberPendingWishlist("p-1", 1_000);
    expect(takePendingWishlist("p-2", 2_000)).toBe(false);
    expect(takePendingWishlist("p-1", 2_000)).toBe(true);
    expect(takePendingWishlist("p-1", 3_000)).toBe(false);
  });

  it("expires after 15 minutes", () => {
    rememberPendingWishlist("p-1", 0);
    expect(takePendingWishlist("p-1", 16 * 60 * 1000)).toBe(false);
  });
});
