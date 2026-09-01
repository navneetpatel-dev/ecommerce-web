export type WalletRechargeLimits = {
  minInr: number;
  maxInr: number;
  maxBalance: number;
  pointsPerRupee?: number;
};

export type WalletRechargeValidationCode =
  | "below-min"
  | "above-max"
  | "max-balance";

export function validateWalletRechargeAmount(
  amountInr: number,
  currentBalance: number,
  limits: WalletRechargeLimits,
): WalletRechargeValidationCode | null {
  if (amountInr < limits.minInr) return "below-min";
  if (amountInr > limits.maxInr) return "above-max";
  const pointsPerRupee = limits.pointsPerRupee ?? 1;
  const pointsToCredit = amountInr * pointsPerRupee;
  if (currentBalance + pointsToCredit > limits.maxBalance) return "max-balance";
  return null;
}
