import { LABELS } from "@/shared/constants/labels";

const SKIP_DETAIL_KEYS = new Set([
  "passwordHash",
  "password",
  "token",
  "refreshToken",
  "accessToken",
  "orderItemId",
  "subOrderId",
  "userId",
  "creditNoteId",
  "debitNoteId",
  "resolvedById",
  "variantId",
  "productId",
  "shippingAddressId",
  "billingAddressId",
  "roleId",
  "razorpayRefundId",
]);

const CUSTOM_LABELS: Record<string, string> = {
  photoUrls: "Customer Photos",
  disputeEvidenceUrls: "Dispute Evidence Photos",
  returnReference: "Return ID",
  orderReference: "Order",
  reasonCode: "Return Reason",
  refundAmount: "Refund Amount",
  refundTaxAmount: "Tax Refund Amount",
  refundMerchandiseAmount: "Merchandise Refund",
  refundCommissionAmount: "Commission Clawback",
  refundTcsAmount: "TCS Adjustment",
  refundNetClawback: "Net Clawback",
  walletRefundAmount: "Wallet Refund",
  razorpayRefundAmount: "Bank/Card Refund",
  returnShippingFeeAmount: "Return Shipping Fee",
  shippingRefundAmount: "Shipping Refund",
  againstInvoiceNumber: "Tax Invoice Reference",
  rejectionReason: "Rejection Reason",
  disputeReason: "Dispute Reason",
  disputeDescription: "Dispute Details",
  disputeStatus: "Dispute Status",
  disputeResolutionNotes: "Dispute Resolution",
  disputedAt: "Dispute Date",
  receivedAt: "Received Date",
  restockedAt: "Restocked Date",
  resolvedAt: "Resolved Date",
  createdAt: "Date Created",
  updatedAt: "Last Updated",
};

export type RecordDetailField = {
  key: string;
  label: string;
  value: unknown;
};

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const isMoneyKey = (k: string): boolean => {
  const lower = k.toLowerCase();
  if (
    lower.includes("count") ||
    lower.includes("quantity") ||
    lower.includes("rate") ||
    lower.includes("percent")
  ) {
    return false;
  }
  return (
    k === "totalAmount" ||
    k === "subtotal" ||
    k === "price" ||
    k === "amount" ||
    k.endsWith("Amount") ||
    k.endsWith("Price") ||
    k.endsWith("Total") ||
    k.endsWith("Fee")
  );
};

export function humanizeKey(key: string): string {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function fieldLabel(key: string): string {
  const labels = LABELS as Record<string, string>;
  return CUSTOM_LABELS[key] ?? labels[key] ?? humanizeKey(key);
}

/** Flatten a row into labeled fields for the detail dialog (skips secrets and internal IDs). */
export function buildRecordDetailFields(
  record: Record<string, unknown>,
): RecordDetailField[] {
  const hasHumanReference =
    Boolean(record.returnReference) ||
    Boolean(record.orderReference) ||
    Boolean(record.reference);

  return Object.keys(record)
    .filter((key) => !SKIP_DETAIL_KEYS.has(key))
    .filter((key) => !(key === "id" && hasHumanReference))
    .filter(
      (key) =>
        !(
          key.endsWith("Id") &&
          typeof record[key] === "string" &&
          UUID_REGEX.test(record[key] as string)
        ),
    )
    .filter((key) => typeof record[key] !== "function")
    .map((key) => ({
      key,
      label: fieldLabel(key),
      value: record[key],
    }));
}

/** Best-effort title for the detail dialog. */
export function getRecordDetailTitle(record: Record<string, unknown>): string {
  const candidates = [
    record.businessName,
    record.productName,
    record.customerName,
    record.vendorName,
    record.actorName,
    record.categoryName,
    record.name,
    record.title,
    record.code,
    record.email,
    record.slug,
  ];
  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim())
      return candidate.trim();
  }
  return LABELS.recordDetails;
}
