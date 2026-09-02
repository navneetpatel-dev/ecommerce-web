import { describe, expect, it } from "vitest";
import {
  walletRechargeValidationLabel,
  type WalletRechargeLimits,
} from "../walletRechargeValidation";

const limits: WalletRechargeLimits = {
  minInr: 1,
  maxInr: 10000,
  maxBalance: 50000,
};

describe("walletRechargeValidationLabel", () => {
  it("returns null for ok validation", () => {
    expect(walletRechargeValidationLabel("ok", limits)).toBeNull();
  });

  it("maps below-min to a label", () => {
    expect(walletRechargeValidationLabel("below-min", limits)).toMatch(/₹1/);
  });

  it("maps above-max to a label", () => {
    expect(walletRechargeValidationLabel("above-max", limits)).toMatch(/10,000/);
  });

  it("maps max-balance to a label", () => {
    expect(walletRechargeValidationLabel("max-balance", limits)).toMatch(
      /50,000/,
    );
  });
});
