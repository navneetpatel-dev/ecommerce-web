import { formatInrExact } from "@/shared/utils/formatting/orderFormat";

export function formatCodAmountLabel(
  amount: number,
  collected: boolean | undefined,
): string {
  return `Cash on delivery: ${formatInrExact(amount)} ${
    collected ? "(collected)" : "(due at doorstep)"
  }`;
}
