import { LABELS } from '@/shared/constants/labels'
import {
  SUPPORT_TICKET_CATEGORY,
  SUPPORT_TICKET_PRIORITY,
  SUPPORT_TICKET_STATUS,
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
