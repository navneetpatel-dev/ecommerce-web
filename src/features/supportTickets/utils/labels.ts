import { LABELS } from '@/shared/constants/labels'
import {
  BUG_AFFECTED_MODULE,
  BUG_REPORT_SEVERITY,
  BUG_REPORT_STATUS,
  BUG_REPORTER_ROLE,
  SUPPORT_TICKET_CATEGORY,
  SUPPORT_TICKET_PRIORITY,
  SUPPORT_TICKET_STATUS,
  type BugAffectedModule,
  type BugReportSeverity,
  type BugReportStatus,
  type BugReporterRole,
  type SupportTicketCategory,
  type SupportTicketPriority,
  type SupportTicketStatus,
} from '@/shared/constants/statuses'

export const TICKET_STATUS_LABEL: Record<SupportTicketStatus, string> = {
  [SUPPORT_TICKET_STATUS.OPEN]: LABELS.ticketStatusOpen,
  [SUPPORT_TICKET_STATUS.IN_PROGRESS]: LABELS.ticketStatusInProgress,
  [SUPPORT_TICKET_STATUS.RESOLVED]: LABELS.ticketStatusResolved,
  [SUPPORT_TICKET_STATUS.CLOSED]: LABELS.ticketStatusClosed,
  [SUPPORT_TICKET_STATUS.REOPENED]: LABELS.ticketStatusReopened,
}

export const TICKET_CATEGORY_LABEL: Record<SupportTicketCategory, string> = {
  [SUPPORT_TICKET_CATEGORY.ORDER]: LABELS.ticketCategoryOrder,
  [SUPPORT_TICKET_CATEGORY.PRODUCT]: LABELS.ticketCategoryProduct,
  [SUPPORT_TICKET_CATEGORY.PAYMENT]: LABELS.ticketCategoryPayment,
  [SUPPORT_TICKET_CATEGORY.VENDOR]: LABELS.ticketCategoryVendor,
  [SUPPORT_TICKET_CATEGORY.OTHER]: LABELS.ticketCategoryOther,
}

export const TICKET_PRIORITY_LABEL: Record<SupportTicketPriority, string> = {
  [SUPPORT_TICKET_PRIORITY.LOW]: LABELS.ticketPriorityLow,
  [SUPPORT_TICKET_PRIORITY.MEDIUM]: LABELS.ticketPriorityMedium,
  [SUPPORT_TICKET_PRIORITY.HIGH]: LABELS.ticketPriorityHigh,
  [SUPPORT_TICKET_PRIORITY.URGENT]: LABELS.ticketPriorityUrgent,
}

export const BUG_STATUS_LABEL: Record<BugReportStatus, string> = {
  [BUG_REPORT_STATUS.NEW]: LABELS.bugStatusNew,
  [BUG_REPORT_STATUS.TRIAGED]: LABELS.bugStatusTriaged,
  [BUG_REPORT_STATUS.IN_PROGRESS]: LABELS.bugStatusInProgress,
  [BUG_REPORT_STATUS.FIXED]: LABELS.bugStatusFixed,
  [BUG_REPORT_STATUS.VERIFIED]: LABELS.bugStatusVerified,
  [BUG_REPORT_STATUS.CLOSED]: LABELS.bugStatusClosed,
  [BUG_REPORT_STATUS.WONT_FIX]: LABELS.bugStatusWontFix,
  [BUG_REPORT_STATUS.DUPLICATE]: LABELS.bugStatusDuplicate,
}

export const BUG_SEVERITY_LABEL: Record<BugReportSeverity, string> = {
  [BUG_REPORT_SEVERITY.LOW]: LABELS.bugSeverityLow,
  [BUG_REPORT_SEVERITY.MEDIUM]: LABELS.bugSeverityMedium,
  [BUG_REPORT_SEVERITY.HIGH]: LABELS.bugSeverityHigh,
  [BUG_REPORT_SEVERITY.CRITICAL]: LABELS.bugSeverityCritical,
}

export const BUG_MODULE_LABEL: Record<BugAffectedModule, string> = {
  [BUG_AFFECTED_MODULE.CATALOG]: LABELS.bugModuleCatalog,
  [BUG_AFFECTED_MODULE.CART]: LABELS.bugModuleCart,
  [BUG_AFFECTED_MODULE.CHECKOUT]: LABELS.bugModuleCheckout,
  [BUG_AFFECTED_MODULE.PAYMENTS]: LABELS.bugModulePayments,
  [BUG_AFFECTED_MODULE.ORDERS]: LABELS.bugModuleOrders,
  [BUG_AFFECTED_MODULE.VENDOR_DASHBOARD]: LABELS.bugModuleVendorDashboard,
  [BUG_AFFECTED_MODULE.ADMIN_DASHBOARD]: LABELS.bugModuleAdminDashboard,
  [BUG_AFFECTED_MODULE.OTHER]: LABELS.bugModuleOther,
}

export const BUG_REPORTER_ROLE_LABEL: Record<BugReporterRole, string> = {
  [BUG_REPORTER_ROLE.CUSTOMER]: LABELS.bugReporterRoleCustomer,
  [BUG_REPORTER_ROLE.VENDOR]: LABELS.bugReporterRoleVendor,
  [BUG_REPORTER_ROLE.VENDOR_STAFF]: LABELS.bugReporterRoleVendorStaff,
}
