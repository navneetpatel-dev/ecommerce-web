/** Support ticket & bug report enums — keep values identical to backend Sequelize ENUMs. */

export const SUPPORT_TICKET_STATUS = {
  OPEN: "OPEN",
  IN_PROGRESS: "IN_PROGRESS",
  RESOLVED: "RESOLVED",
  CLOSED: "CLOSED",
  REOPENED: "REOPENED",
} as const;
export type SupportTicketStatus =
  (typeof SUPPORT_TICKET_STATUS)[keyof typeof SUPPORT_TICKET_STATUS];
export const SUPPORT_TICKET_STATUS_VALUES = Object.values(
  SUPPORT_TICKET_STATUS,
) as [SupportTicketStatus, ...SupportTicketStatus[]];

export const SUPPORT_TICKET_CATEGORY = {
  ORDER: "ORDER",
  PRODUCT: "PRODUCT",
  PAYMENT: "PAYMENT",
  VENDOR: "VENDOR",
  OTHER: "OTHER",
} as const;
export type SupportTicketCategory =
  (typeof SUPPORT_TICKET_CATEGORY)[keyof typeof SUPPORT_TICKET_CATEGORY];
export const SUPPORT_TICKET_CATEGORY_VALUES = Object.values(
  SUPPORT_TICKET_CATEGORY,
) as [SupportTicketCategory, ...SupportTicketCategory[]];

export const SUPPORT_TICKET_PRIORITY = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  URGENT: "URGENT",
} as const;
export type SupportTicketPriority =
  (typeof SUPPORT_TICKET_PRIORITY)[keyof typeof SUPPORT_TICKET_PRIORITY];
export const SUPPORT_TICKET_PRIORITY_VALUES = Object.values(
  SUPPORT_TICKET_PRIORITY,
) as [SupportTicketPriority, ...SupportTicketPriority[]];

export const TICKET_ATTACHMENT_TYPE = {
  IMAGE: "IMAGE",
  VIDEO: "VIDEO",
} as const;
export type TicketAttachmentType =
  (typeof TICKET_ATTACHMENT_TYPE)[keyof typeof TICKET_ATTACHMENT_TYPE];
export const TICKET_ATTACHMENT_TYPE_VALUES = Object.values(
  TICKET_ATTACHMENT_TYPE,
) as [TicketAttachmentType, ...TicketAttachmentType[]];

export const TICKET_SENDER_ROLE = {
  CUSTOMER: "CUSTOMER",
  VENDOR: "VENDOR",
  VENDOR_STAFF: "VENDOR_STAFF",
  ADMIN: "ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN_ORDER_MANAGER: "ADMIN_ORDER_MANAGER",
  ADMIN_CATALOG_MANAGER: "ADMIN_CATALOG_MANAGER",
} as const;
export type TicketSenderRole =
  (typeof TICKET_SENDER_ROLE)[keyof typeof TICKET_SENDER_ROLE];

export const BUG_REPORT_STATUS = {
  NEW: "NEW",
  TRIAGED: "TRIAGED",
  IN_PROGRESS: "IN_PROGRESS",
  FIXED: "FIXED",
  VERIFIED: "VERIFIED",
  CLOSED: "CLOSED",
  WONT_FIX: "WONT_FIX",
  DUPLICATE: "DUPLICATE",
} as const;
export type BugReportStatus =
  (typeof BUG_REPORT_STATUS)[keyof typeof BUG_REPORT_STATUS];
export const BUG_REPORT_STATUS_VALUES = Object.values(BUG_REPORT_STATUS) as [
  BugReportStatus,
  ...BugReportStatus[],
];

export const BUG_REPORT_SEVERITY = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  CRITICAL: "CRITICAL",
} as const;
export type BugReportSeverity =
  (typeof BUG_REPORT_SEVERITY)[keyof typeof BUG_REPORT_SEVERITY];
export const BUG_REPORT_SEVERITY_VALUES = Object.values(
  BUG_REPORT_SEVERITY,
) as [BugReportSeverity, ...BugReportSeverity[]];

export const BUG_AFFECTED_MODULE = {
  CATALOG: "CATALOG",
  CART: "CART",
  CHECKOUT: "CHECKOUT",
  PAYMENTS: "PAYMENTS",
  ORDERS: "ORDERS",
  VENDOR_DASHBOARD: "VENDOR_DASHBOARD",
  ADMIN_DASHBOARD: "ADMIN_DASHBOARD",
  OTHER: "OTHER",
} as const;
export type BugAffectedModule =
  (typeof BUG_AFFECTED_MODULE)[keyof typeof BUG_AFFECTED_MODULE];
export const BUG_AFFECTED_MODULE_VALUES = Object.values(
  BUG_AFFECTED_MODULE,
) as [BugAffectedModule, ...BugAffectedModule[]];

export const BUG_REPORTER_ROLE = {
  CUSTOMER: "CUSTOMER",
  VENDOR: "VENDOR",
  VENDOR_STAFF: "VENDOR_STAFF",
} as const;
export type BugReporterRole =
  (typeof BUG_REPORTER_ROLE)[keyof typeof BUG_REPORTER_ROLE];
export const BUG_REPORTER_ROLE_VALUES = Object.values(BUG_REPORTER_ROLE) as [
  BugReporterRole,
  ...BugReporterRole[],
];

export const BUG_ATTACHMENT_TYPE = {
  SCREENSHOT: "SCREENSHOT",
  SCREEN_RECORDING: "SCREEN_RECORDING",
} as const;
export type BugAttachmentType =
  (typeof BUG_ATTACHMENT_TYPE)[keyof typeof BUG_ATTACHMENT_TYPE];
export const BUG_ATTACHMENT_TYPE_VALUES = Object.values(
  BUG_ATTACHMENT_TYPE,
) as [BugAttachmentType, ...BugAttachmentType[]];
