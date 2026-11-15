export const ADMIN_COMMISSION_COLUMN_KEYS = [
  "vendorName",
  "saleAmount",
  "commissionRate",
  "commissionAmount",
  "status",
  "createdAt",
] as const;

export const ADMIN_COMMISSION_INVOICE_COLUMN_KEYS = [
  "number",
  "vendorName",
  "taxableAmount",
  "gstAmount",
  "totalAmount",
  "issuedAt",
] as const;

export const ADMIN_PAYOUT_COLUMN_KEYS = [
  "vendorName",
  "grossAmount",
  "tdsAmount",
  "commissionGstAmount",
  "adjustmentAmount",
  "amount",
  "periodStart",
  "periodEnd",
  "status",
  "paymentMethod",
  "paymentReferenceNumber",
  "paidAt",
  "failureReason",
  "createdAt",
] as const;
