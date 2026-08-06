import { apiClient } from '@/shared/api/client'
import type { CurrentUser, AuthSession } from '@/shared/api/types'
import type { LoginInput, RegisterInput, ChangePasswordInput } from '../schemas/auth.schema'

interface AuthResponse {
  accessToken: string
  user: CurrentUser
}

export const authApi = {
  login: (input: LoginInput) => apiClient.post<AuthResponse>('/api/auth/login', input),
  register: (input: RegisterInput) => apiClient.post<AuthResponse>('/api/auth/register', input),
  me: () => apiClient.get<CurrentUser>('/api/auth/me'),
  refresh: () => apiClient.post<{ accessToken: string }>('/api/auth/refresh'),
  logout: () => apiClient.post<{ message: string }>('/api/auth/logout'),
  forgotPassword: (email: string) =>
    apiClient.post<{ message: string }>('/api/auth/forgot-password', { email }),
  resetPassword: (token: string, newPassword: string) =>
    apiClient.post<{ message: string }>('/api/auth/reset-password', { token, newPassword }),
  changePassword: (input: ChangePasswordInput) =>
    apiClient.post<{ message: string }>('/api/auth/change-password', input),
  listSessions: () => apiClient.get<AuthSession[]>('/api/auth/sessions'),
  revokeSession: (family: string) => apiClient.delete<void>(`/api/auth/sessions/${family}`),
  revokeOtherSessions: () => apiClient.delete<void>('/api/auth/sessions'),
}
