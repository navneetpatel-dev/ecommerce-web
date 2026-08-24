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
} from "./api/auth.queries";
export { authApi } from "./api/auth.api";
export { useAuthStore, defaultRouteForRole } from "@/shared/stores/auth.store";
export { LoginForm } from "./pages/LoginForm.page";
export { RegisterForm } from "./pages/RegisterForm.page";
export { useAuthBootstrap } from "./hooks/useAuthBootstrap.hook";
export { ForgotPasswordPage } from "./pages/ForgotPasswordPage.page";
export { OtpPage } from "./pages/OtpPage.page";
export { ResetPasswordPage } from "./pages/ResetPasswordPage.page";
export { VerifyEmailPage } from "./pages/VerifyEmailPage.page";
export { AuthPageSkeleton } from "./components/AuthPageSkeleton.component";
export { ChangePasswordSection } from "./components/ChangePasswordSection.component";
export { useProfilePage } from "./hooks/useProfilePage.hook";
export {
  useSessions,
  useRevokeSession,
  useRevokeOtherSessions,
} from "./api/auth.queries";
