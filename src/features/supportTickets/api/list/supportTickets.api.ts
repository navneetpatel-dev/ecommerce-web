import { apiClient } from '@/shared/api/client/client'
import { API } from '@/shared/constants/apiRoutes'
import {
  fetchCursorPage,
  type CursorPage,
} from '@/shared/api/client/cursorPagination'
import { buildSearchParams } from '@/shared/api/client/pagination'
import type {
  SupportTicketCategory,
  SupportTicketPriority,
  SupportTicketStatus,
  TicketAttachmentType,
  TicketSenderRole,
} from '@/shared/constants/statuses'

export type TicketAttachment = {
  id?: string
  ticketId?: string
  messageId?: string | null
  url: string
  type: TicketAttachmentType
  durationSeconds?: number | null
  createdAt?: string
}

export type TicketAttachmentInput = {
  url: string
  type: TicketAttachmentType
  durationSeconds?: number | null
}

export type TicketMessage = {
  id: string
  ticketId: string
  senderId: string
  senderRole: TicketSenderRole
  senderName: string | null
  body: string
  createdAt: string
  attachments: TicketAttachment[]
}

export type SupportTicket = {
  id: string
  ticketNumber: string
  customerId: string
  customerName: string | null
  subject: string
  description: string
  category: SupportTicketCategory
  relatedOrderId: string | null
  relatedVendorId: string | null
  vendorName: string | null
  priority: SupportTicketPriority
  status: SupportTicketStatus
  assignedToId: string | null
  assignedToName: string | null
  firstResponseAt: string | null
  resolvedAt: string | null
  closedAt: string | null
  customerSatisfactionRating: number | null
  createdAt: string
  updatedAt: string
  latestMessagePreview?: string | null
  hasUnread?: boolean
  messages?: TicketMessage[]
  attachments?: TicketAttachment[]
  imageAttachmentCount?: number
  videoAttachmentCount?: number
}

export type CreateSupportTicketBody = {
  subject: string
  description: string
  category: SupportTicketCategory
  relatedOrderId?: string | null
  relatedVendorId?: string | null
  attachmentUrls?: TicketAttachmentInput[]
}

export type ReplySupportTicketBody = {
  body: string
  attachmentUrls?: TicketAttachmentInput[]
}

export type { CursorPage }

function buildQuery(params: Record<string, string | number | undefined | null>): string {
  return buildSearchParams(params).toString()
}

export type TicketListParams = {
  limit?: number
  cursor?: string | null
  status?: SupportTicketStatus
  priority?: SupportTicketPriority
  category?: SupportTicketCategory
  vendorId?: string
}

export const supportTicketsApi = {
  create: (body: CreateSupportTicketBody) =>
    apiClient.post<SupportTicket>(API.supportTickets.root, body),

  listMine: (params: TicketListParams = {}) =>
    fetchCursorPage<SupportTicket>(
      API.supportTickets.mine(
        buildQuery({
          limit: params.limit,
          cursor: params.cursor,
          status: params.status,
          priority: params.priority,
          category: params.category,
        }),
      ),
    ),

  listVendor: (params: TicketListParams = {}) =>
    fetchCursorPage<SupportTicket>(
      API.supportTickets.vendor(
        buildQuery({
          limit: params.limit,
          cursor: params.cursor,
          status: params.status,
          priority: params.priority,
          category: params.category,
        }),
      ),
    ),

  listAdmin: (params: TicketListParams = {}) =>
    fetchCursorPage<SupportTicket>(
      API.supportTickets.admin(
        buildQuery({
          limit: params.limit,
          cursor: params.cursor,
          status: params.status,
          priority: params.priority,
          category: params.category,
          vendorId: params.vendorId,
        }),
      ),
    ),

  getById: (id: string) => apiClient.get<SupportTicket>(API.supportTickets.detail(id)),

  listMessages: (id: string, params: { limit?: number; cursor?: string | null } = {}) =>
    fetchCursorPage<TicketMessage>(
      API.supportTickets.messages(
        id,
        buildQuery({ limit: params.limit, cursor: params.cursor }),
      ),
    ),

  reply: (id: string, body: ReplySupportTicketBody) =>
    apiClient.post<SupportTicket>(API.supportTickets.reply(id), body),

  resolve: (id: string) => apiClient.post<SupportTicket>(API.supportTickets.resolve(id)),

  reopen: (id: string) => apiClient.post<SupportTicket>(API.supportTickets.reopen(id)),

  close: (id: string) => apiClient.post<SupportTicket>(API.supportTickets.close(id)),

  reassign: (id: string, assignedToId: string) =>
    apiClient.post<SupportTicket>(API.supportTickets.reassign(id), { assignedToId }),

  updatePriority: (id: string, priority: SupportTicketPriority) =>
    apiClient.post<SupportTicket>(API.supportTickets.priority(id), { priority }),

  escalate: (id: string) => apiClient.post<SupportTicket>(API.supportTickets.escalate(id)),

  rate: (id: string, rating: number) =>
    apiClient.post<SupportTicket>(API.supportTickets.rate(id), { rating }),
}
