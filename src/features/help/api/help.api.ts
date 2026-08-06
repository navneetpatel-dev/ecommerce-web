import { apiClient } from '@/shared/api/client'
import { API } from '@/shared/constants/apiRoutes'

export type HelpTicketTopic =
  | 'ORDERS'
  | 'SHIPPING'
  | 'RETURNS'
  | 'PAYMENTS'
  | 'ACCOUNT'
  | 'PRODUCTS'
  | 'SELLERS'
  | 'OTHER'

export type CreateHelpTicketBody = {
  name: string
  email: string
  topic: HelpTicketTopic
  subject: string
  message: string
  orderId?: string | null
}

export type HelpTicket = {
  id: string
  topic: HelpTicketTopic
  subject: string
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
  createdAt: string
}

export const helpApi = {
  createTicket: (body: CreateHelpTicketBody) =>
    apiClient.post<HelpTicket>(API.help.tickets, body),
  myTickets: () => apiClient.get<HelpTicket[]>(`${API.help.tickets}/mine`),
}
