import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { validateWalletRechargeAmount } from "../walletRechargeValidation";

describe("validateWalletRechargeAmount", () => {
  const limits = { minInr: 100, maxInr: 10000, maxBalance: 50000 };

  it("flags below minimum", () => {
    assert.equal(validateWalletRechargeAmount(50, 0, limits), "below-min");
  });

  it("flags above maximum", () => {
    assert.equal(validateWalletRechargeAmount(15000, 0, limits), "above-max");
  });

  it("flags projected balance cap", () => {
    assert.equal(validateWalletRechargeAmount(1000, 49500, limits), "max-balance");
  });

  it("accepts valid recharge", () => {
    assert.equal(validateWalletRechargeAmount(500, 1000, limits), null);
  });
});
