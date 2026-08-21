// Auth feature — public API
export {
  useLogin,
  useRegister,
  useLogout,
  useForgotPassword,
  useResetPassword,
  useChangePassword,
} from "./api/auth.queries";
export { useAuthStore, defaultRouteForRole } from "@/shared/stores/auth.store";
export { LoginForm } from "./pages/LoginForm";
export { RegisterForm } from "./pages/RegisterForm";
export { useAuthBootstrap } from "./hooks/useAuthBootstrap";
