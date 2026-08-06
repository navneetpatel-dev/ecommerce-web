import { apiClient } from '@/shared/api/client'
import { API } from '@/shared/constants/apiRoutes'
import type { CurrentUser, AuthSession } from '@/shared/api/types'
import type { LoginInput, RegisterInput, ChangePasswordInput } from '../schemas/auth.schema'

interface AuthResponse {
  accessToken: string
  user: CurrentUser
}

export const authApi = {
  login: (input: LoginInput) => apiClient.post<AuthResponse>(API.auth.login, input),
  register: (input: RegisterInput) => apiClient.post<AuthResponse>(API.auth.register, input),
  me: () => apiClient.get<CurrentUser>(API.auth.me),
  refresh: () => apiClient.post<{ accessToken: string }>(API.auth.refresh),
  logout: () => apiClient.post<{ message: string }>(API.auth.logout),
  forgotPassword: (email: string) =>
    apiClient.post<{ message: string }>(API.auth.forgotPassword, { email }),
  resetPassword: (token: string, newPassword: string) =>
    apiClient.post<{ message: string }>(API.auth.resetPassword, { token, newPassword }),
  changePassword: (input: ChangePasswordInput) =>
    apiClient.post<{ message: string }>(API.auth.changePassword, input),
  listSessions: () => apiClient.get<AuthSession[]>(API.auth.sessions),
  revokeSession: (family: string) => apiClient.delete<void>(API.auth.session(family)),
  revokeOtherSessions: () => apiClient.delete<void>(API.auth.sessions),
}
