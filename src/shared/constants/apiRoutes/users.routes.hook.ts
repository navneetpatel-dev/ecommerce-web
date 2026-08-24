/** Frontend user API path builders — must stay aligned with backend mounts under `/api`. */
export const usersRoutes = {
  list: (query = "") => `/api/users${query ? `?${query}` : ""}`,
  assignees: (query = "") => `/api/users/assignees${query ? `?${query}` : ""}`,
  detail: (id: string) => `/api/users/${id}`,
  status: (id: string) => `/api/users/${id}/status`,
} as const;

export const usersMeRoutes = {
  profile: "/api/users/me",
  export: "/api/users/me/export",
  addresses: "/api/users/addresses",
  address: (id: string) => `/api/users/addresses/${id}`,
  addressDefault: (id: string) => `/api/users/addresses/${id}/default`,
} as const;
