import { apiClient } from "@/shared/api/client/client";
import { API } from "@/shared/constants/apiRoutes";
import {
  unwrapPaginatedList,
  withQuery,
  type PaginatedList,
} from "@/shared/api/client/pagination";
import { DEFAULT_PAGE_LIMIT } from "@/shared/constants/pagination/pagination";
import type { CurrentUser, AuthSession } from "@/shared/api/types";
import type {
  LoginInput,
  RegisterInput,
  ChangePasswordInput,
} from "../../schemas/auth/auth.schema";

interface AuthResponse {
  accessToken: string;
  user: CurrentUser;
}

interface RegisterResponse {
  user: { id: string; email: string; name: string };
  requiresVerification: true;
}

export const authApi = {
  login: (input: LoginInput) =>
    apiClient.post<AuthResponse>(API.auth.login, input),
  requestOtp: (email: string) =>
    apiClient.post<{ message: string }>(API.auth.requestOtp, { email }),
  verifyOtp: (email: string, code: string) =>
    apiClient.post<AuthResponse>(API.auth.verifyOtp, { email, code }),
  register: (input: RegisterInput) =>
    apiClient.post<RegisterResponse>(API.auth.register, input),
  me: () => apiClient.get<CurrentUser>(API.auth.me),
  refresh: () => apiClient.post<{ accessToken: string }>(API.auth.refresh),
  logout: () => apiClient.post<{ message: string }>(API.auth.logout),
  forgotPassword: (email: string) =>
    apiClient.post<{ message: string }>(API.auth.forgotPassword, { email }),
  resetPassword: (token: string, newPassword: string) =>
    apiClient.post<{ message: string }>(API.auth.resetPassword, {
      token,
      newPassword,
    }),
  verifyEmail: (token: string) =>
    apiClient.post<{ verified: boolean }>(API.auth.verifyEmail, { token }),
  resendVerification: () =>
    apiClient.post<{ sent: boolean; alreadyVerified: boolean }>(
      API.auth.resendVerification,
    ),
  resendVerificationByEmail: (email: string) =>
    apiClient.post<{ sent: boolean; alreadyVerified: boolean }>(
      API.auth.resendVerificationByEmail,
      { email },
    ),
  changePassword: (input: ChangePasswordInput) =>
    apiClient.post<{ message: string }>(API.auth.changePassword, input),
  /** Signed-in devices, this one first, a page at a time (B-44). */
  listSessions: async (page = 1): Promise<PaginatedList<AuthSession>> =>
    unwrapPaginatedList(
      await apiClient.getWithResponse<AuthSession[]>(
        withQuery(API.auth.sessions, { page, limit: DEFAULT_PAGE_LIMIT }),
      ),
    ),
  revokeSession: (family: string) =>
    apiClient.delete<void>(API.auth.session(family)),
  revokeOtherSessions: () => apiClient.delete<void>(API.auth.sessions),
  /** Support-only: issues a short-lived token impersonating the target user. */
  impersonate: (userId: string) =>
    apiClient.post<AuthResponse>(API.auth.impersonate(userId), {}),
};
