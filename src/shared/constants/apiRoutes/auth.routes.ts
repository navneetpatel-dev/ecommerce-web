/** Frontend auth API path builders — must stay aligned with backend mounts under `/api`. */
export const authRoutes = {
  login: "/api/auth/login",
  requestOtp: "/api/auth/otp/request",
  verifyOtp: "/api/auth/otp/verify",
  register: "/api/auth/register",
  me: "/api/auth/me",
  refresh: "/api/auth/refresh",
  logout: "/api/auth/logout",
  forgotPassword: "/api/auth/forgot-password",
  resetPassword: "/api/auth/reset-password",
  verifyEmail: "/api/auth/verify-email",
  resendVerification: "/api/auth/resend-verification",
  changePassword: "/api/auth/change-password",
  sessions: "/api/auth/sessions",
  session: (family: string) => `/api/auth/sessions/${family}`,
} as const;
