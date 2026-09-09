export function formatCodAmountLabel(
  amount: number,
  collected: boolean | undefined,
): string {
  return `Cash on delivery: ₹${amount.toFixed(2)} ${
    collected ? "(collected)" : "(due at doorstep)"
  }`;
}
