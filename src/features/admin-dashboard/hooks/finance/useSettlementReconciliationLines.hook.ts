import { useMemo } from "react";
import { LABELS } from "@/shared/constants/labels";
import { formatInr } from "@/shared/utils/formatting/orderFormat";
import type { ReconciliationReport } from "../../api/finance/reports.api";

export type ReconciliationLine = { key: string; label: string; value: string };

/**
 * The settlement identity as the API returned it, line by line: customer payments on
 * one side, and what they became on the other (vendor net − platform-funded coupons +
 * commission + TCS + platform goods + shipping − shipping refunded + return fees kept +
 * gift wrap + refunds = accounted total). GST sits inside vendor net, so it is listed
 * for reference only. No amounts are worked out here.
 */
export function useSettlementReconciliationLines(
  recon: ReconciliationReport,
): ReconciliationLine[] {
  return useMemo(
    () => [
      {
        key: "customerPayments",
        label: LABELS.customerPayments,
        value: formatInr(recon.customerPayments),
      },
      {
        key: "vendorNetPayouts",
        label: LABELS.vendorNetPayouts,
        value: formatInr(recon.vendorNetPayouts),
      },
      {
        key: "platformFundedDiscount",
        label: LABELS.platformFundedDiscount,
        value: formatInr(recon.platformFundedDiscount),
      },
      {
        key: "platformCommission",
        label: LABELS.platformCommission,
        value: formatInr(recon.platformCommission),
      },
      {
        key: "tcsCollected",
        label: LABELS.tcsCollected,
        value: formatInr(recon.tcsCollected),
      },
      {
        key: "platformGoodsSales",
        label: LABELS.platformGoodsSales,
        value: formatInr(recon.platformGoodsSales),
      },
      {
        key: "shippingCollected",
        label: LABELS.shippingCollected,
        value: formatInr(recon.shippingCollected),
      },
      {
        key: "shippingRefunded",
        label: LABELS.shippingRefunded,
        value: formatInr(recon.shippingRefunded),
      },
      {
        key: "returnFeesKept",
        label: LABELS.returnFeesKept,
        value: formatInr(recon.returnFeesKept),
      },
      {
        key: "giftWrapCollected",
        label: LABELS.giftWrapCollected,
        value: formatInr(recon.giftWrapCollected),
      },
      {
        key: "refundsToCustomer",
        label: LABELS.refundsToCustomer,
        value: formatInr(recon.refundsToCustomer),
      },
      {
        key: "taxCollected",
        label: LABELS.taxCollected,
        value: formatInr(recon.taxCollected),
      },
      {
        key: "accountedTotal",
        label: LABELS.accountedTotal,
        value: formatInr(recon.accountedTotal),
      },
    ],
    [recon],
  );
}
