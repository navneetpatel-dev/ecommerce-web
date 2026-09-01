import { describe, expect, it } from "vitest";
import {
  validateWalletRechargeAmount,
  type WalletRechargeLimits,
} from "../walletRechargeValidation";

const limits: WalletRechargeLimits = {
  minInr: 1,
  maxInr: 10000,
  maxBalance: 50000,
  pointsPerRupee: 2,
};

describe("validateWalletRechargeAmount", () => {
  it("rejects amount below minimum", () => {
    expect(validateWalletRechargeAmount(0, 0, limits)).toBe("below-min");
  });

  it("rejects amount above maximum", () => {
    expect(validateWalletRechargeAmount(20000, 0, limits)).toBe("above-max");
  });

  it("allows valid recharge amount", () => {
    expect(validateWalletRechargeAmount(500, 0, limits)).toBeNull();
  });

  it("rejects when bonus points would exceed max balance", () => {
    expect(validateWalletRechargeAmount(1, 49999, limits)).toBe("max-balance");
  });

  it("allows recharge when bonus points fit under cap", () => {
    expect(validateWalletRechargeAmount(1, 49998, limits)).toBeNull();
  });
});
