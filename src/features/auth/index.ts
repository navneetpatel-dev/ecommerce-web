// Auth feature — public API
export {
  useLogin,
  useRegister,
  useLogout,
  useForgotPassword,
  useResetPassword,
  useChangePassword,
} from "./api/auth.queries";
export { authApi } from "./api/auth.api";
export { useAuthStore, defaultRouteForRole } from "@/shared/stores/auth.store";
export { LoginForm } from "./pages/LoginForm";
export { RegisterForm } from "./pages/RegisterForm";
export { useAuthBootstrap } from "./hooks/useAuthBootstrap";
export { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
export { OtpPage } from "./pages/OtpPage";
export { ResetPasswordPage } from "./pages/ResetPasswordPage";
export { AuthPageSkeleton } from "./components/AuthPageSkeleton";
