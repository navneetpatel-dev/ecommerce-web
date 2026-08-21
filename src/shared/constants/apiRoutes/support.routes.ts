/** Frontend support ticket & bug report API path builders — must stay aligned with backend mounts under `/api`. */
export const supportTicketsRoutes = {
  root: "/api/support-tickets",
  mine: (query = "") => `/api/support-tickets/mine${query ? `?${query}` : ""}`,
  vendor: (query = "") =>
    `/api/support-tickets/vendor${query ? `?${query}` : ""}`,
  admin: (query = "") =>
    `/api/support-tickets/admin${query ? `?${query}` : ""}`,
  detail: (id: string) => `/api/support-tickets/${id}`,
  messages: (id: string, query = "") =>
    `/api/support-tickets/${id}/messages${query ? `?${query}` : ""}`,
  reply: (id: string) => `/api/support-tickets/${id}/messages`,
  resolve: (id: string) => `/api/support-tickets/${id}/resolve`,
  reopen: (id: string) => `/api/support-tickets/${id}/reopen`,
  close: (id: string) => `/api/support-tickets/${id}/close`,
  reassign: (id: string) => `/api/support-tickets/${id}/reassign`,
  priority: (id: string) => `/api/support-tickets/${id}/priority`,
  escalate: (id: string) => `/api/support-tickets/${id}/escalate`,
  rate: (id: string) => `/api/support-tickets/${id}/rate`,
} as const;

export const bugReportsRoutes = {
  root: "/api/bug-reports",
  mine: (query = "") => `/api/bug-reports/mine${query ? `?${query}` : ""}`,
  admin: (query = "") => `/api/bug-reports/admin${query ? `?${query}` : ""}`,
  detail: (id: string) => `/api/bug-reports/${id}`,
  triage: (id: string) => `/api/bug-reports/${id}/triage`,
  assignment: (id: string) => `/api/bug-reports/${id}/assignment`,
  status: (id: string) => `/api/bug-reports/${id}/status`,
  duplicate: (id: string) => `/api/bug-reports/${id}/duplicate`,
  wontFix: (id: string) => `/api/bug-reports/${id}/wont-fix`,
  verify: (id: string) => `/api/bug-reports/${id}/verify`,
  comments: (id: string, query = "") =>
    `/api/bug-reports/${id}/comments${query ? `?${query}` : ""}`,
} as const;
