import type { SubOrder } from "@/shared/api/types";

/**
 * Why a part of an order has no tax invoice to download.
 *
 * Invoices are numbered at dispatch (`pricing/taxInvoiceIssue`), so a part that has not
 * shipped has none yet — and a part that was cancelled before dispatch or came back
 * undelivered (reversed) never gets one: there is no taxable supply to invoice.
 */
export type TaxInvoicePartState =
  "issued" | "awaitingDispatch" | "notApplicable";

export type TaxInvoiceAvailability = {
  stateBySubOrder: Record<string, TaxInvoicePartState>;
  /** True once any part has its number — the ZIP then has something to pack. */
  hasDownloadableInvoice: boolean;
  allInvoicesDisabled: boolean;
  singleInvoiceDisabled: boolean;
};

/** The statuses of a part that was reversed and refunded — never invoiced. */
const REVERSED_PART_STATUSES = new Set(["CANCELLED", "RETURNED"]);

export function resolveTaxInvoiceAvailability(
  subOrders: SubOrder[],
): TaxInvoiceAvailability {
  const stateBySubOrder: Record<string, TaxInvoicePartState> = {};
  for (const sub of subOrders) {
    stateBySubOrder[sub.id] = sub.taxInvoiceNumber
      ? "issued"
      : REVERSED_PART_STATUSES.has(sub.status)
        ? "notApplicable"
        : "awaitingDispatch";
  }

  const hasDownloadableInvoice = subOrders.some((sub) =>
    Boolean(sub.taxInvoiceNumber),
  );

  return {
    stateBySubOrder,
    hasDownloadableInvoice,
    allInvoicesDisabled: !hasDownloadableInvoice,
    // A single-seller order has one part; the ZIP endpoint falls back to that one PDF.
    singleInvoiceDisabled: !subOrders[0]?.taxInvoiceNumber,
  };
}
