export type WalletRechargeLimits = {
  minInr: number;
  maxInr: number;
  maxBalance: number;
};

export function validateWalletRechargeAmount(
  amountInr: number,
  currentBalance: number,
  limits: WalletRechargeLimits,
): string | null {
  if (amountInr < limits.minInr) return "below-min";
  if (amountInr > limits.maxInr) return "above-max";
  if (currentBalance + amountInr > limits.maxBalance) return "max-balance";
  return null;
}
