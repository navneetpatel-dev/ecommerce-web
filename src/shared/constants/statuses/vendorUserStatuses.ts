/** Vendor / user account status enums — keep values identical to backend Sequelize ENUMs. */

export const VENDOR_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  SUSPENDED: "SUSPENDED",
} as const;
export type VendorStatus = (typeof VENDOR_STATUS)[keyof typeof VENDOR_STATUS];

export const VENDOR_ENTITY_TYPE = {
  SOLE_PROPRIETORSHIP: "SOLE_PROPRIETORSHIP",
  PARTNERSHIP: "PARTNERSHIP",
  LLP: "LLP",
  PRIVATE_LIMITED: "PRIVATE_LIMITED",
} as const;
export type VendorEntityType =
  (typeof VENDOR_ENTITY_TYPE)[keyof typeof VENDOR_ENTITY_TYPE];
export const VENDOR_ENTITY_TYPE_VALUES = Object.values(VENDOR_ENTITY_TYPE) as [
  VendorEntityType,
  ...VendorEntityType[],
];

export const VENDOR_DOCUMENT_CHECKLIST_STATUS = {
  NOT_UPLOADED: "NOT_UPLOADED",
  PENDING_REVIEW: "PENDING_REVIEW",
  VERIFIED: "VERIFIED",
  REJECTED: "REJECTED",
} as const;
export type VendorDocumentChecklistStatus =
  (typeof VENDOR_DOCUMENT_CHECKLIST_STATUS)[keyof typeof VENDOR_DOCUMENT_CHECKLIST_STATUS];

export const USER_STATUS = {
  ACTIVE: "ACTIVE",
  BLOCKED: "BLOCKED",
} as const;
export type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];

export const VENDOR_DOCUMENT_TYPE = {
  GST_CERT: "GST_CERT",
  PAN: "PAN",
  AADHAAR: "AADHAAR",
  BANK_PROOF: "BANK_PROOF",
  ADDRESS_PROOF: "ADDRESS_PROOF",
  INCORPORATION_CERT: "INCORPORATION_CERT",
  PARTNERSHIP_DEED: "PARTNERSHIP_DEED",
  AUTHORIZED_SIGNATORY_ID: "AUTHORIZED_SIGNATORY_ID",
  FSSAI_LICENSE: "FSSAI_LICENSE",
  CATEGORY_TRADE_LICENSE: "CATEGORY_TRADE_LICENSE",
} as const;
export type VendorDocumentType =
  (typeof VENDOR_DOCUMENT_TYPE)[keyof typeof VENDOR_DOCUMENT_TYPE];
export const VENDOR_DOCUMENT_TYPE_VALUES = Object.values(
  VENDOR_DOCUMENT_TYPE,
) as [VendorDocumentType, ...VendorDocumentType[]];

/** Matches payouts table ENUM (not commission ledger). */
export const PAYOUT_STATUS = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  PAID: "PAID",
  FAILED: "FAILED",
} as const;
export type PayoutStatus = (typeof PAYOUT_STATUS)[keyof typeof PAYOUT_STATUS];

export const COMMISSION_STATUS = {
  PENDING: "PENDING",
  SETTLED: "SETTLED",
  CLAWED_BACK: "CLAWED_BACK",
} as const;
export type CommissionStatus =
  (typeof COMMISSION_STATUS)[keyof typeof COMMISSION_STATUS];

export const WALLET_LEDGER_TYPE = {
  CREDIT: "CREDIT",
  DEBIT: "DEBIT",
} as const;
export type WalletLedgerType =
  (typeof WALLET_LEDGER_TYPE)[keyof typeof WALLET_LEDGER_TYPE];
