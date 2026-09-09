// Auth feature — public API
export {
  useLogin,
  useRegister,
  useLogout,
  useForgotPassword,
  useResetPassword,
  useVerifyEmail,
  useResendVerification,
  useChangePassword,
} from "./api/auth/auth.queries";
export { authApi } from "./api/auth/auth.api";
export { useAuthStore, defaultRouteForRole } from "@/shared/stores/auth/auth.store";
export { LoginForm } from "./pages/login/LoginForm.page";
export { RegisterForm } from "./pages/register/RegisterForm.page";
export { useAuthBootstrap } from "./hooks/bootstrap/useAuthBootstrap.hook";
export { ForgotPasswordPage } from "./pages/password/ForgotPasswordPage.page";
export { OtpPage } from "./pages/otp/OtpPage.page";
export { ResetPasswordPage } from "./pages/password/ResetPasswordPage.page";
export { VerifyEmailPage } from "./pages/verify-email/VerifyEmailPage.page";
export { OAuthCallbackPage } from "./pages/oauth/OAuthCallbackPage.page";
export { AuthPageSkeleton } from "./components/shell/AuthPageSkeleton.component";
export { ChangePasswordSection } from "./components/password/ChangePasswordSection.component";
export { useProfilePage } from "./hooks/profile/useProfilePage.hook";
export { useImpersonation } from "./hooks/impersonation/useImpersonation.hook";
export { ImpersonationBanner } from "./components/impersonation/ImpersonationBanner.component";
export {
  useSessions,
  useRevokeSession,
  useRevokeOtherSessions,
} from "./api/auth/auth.queries";
