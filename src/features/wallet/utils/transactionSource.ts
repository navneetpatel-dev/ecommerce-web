import { LABELS } from "@/shared/constants/labels";
import type { WalletTransaction } from "@/shared/api/types";

/** Maps a wallet transaction's reference type to its display label (Rule 8). */
export function transactionSourceLabel(row: WalletTransaction): string {
  const ref = (row.referenceType ?? "").toUpperCase();
  if (ref.includes("CLAWBACK")) return LABELS.walletTransactionSourceClawback;
  if (ref.includes("TOPUP")) return LABELS.walletTransactionSourceTopup;
  if (ref.includes("CASHBACK")) return LABELS.walletTransactionSourceCashback;
  if (ref.includes("COD_REFUND"))
    return LABELS.walletTransactionSourceCodRefund;
  if (ref.includes("WALLET_REFUND") || ref.includes("RETURN")) {
    return LABELS.walletTransactionSourceWalletRefund;
  }
  if (ref.includes("ORDER") || row.type === "DEBIT")
    return LABELS.walletTransactionSourceCheckout;
  return LABELS.walletTransactionSourceOther;
}
