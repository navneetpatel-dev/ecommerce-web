import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useAuthStore, defaultRouteForRole } from '../store/auth.store'
import { authApi } from './auth.api'
import type { LoginInput, RegisterInput } from '../schemas/auth.schema'

export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession)
  const router = useRouter()

  return useMutation({
    mutationFn: (input: LoginInput) => authApi.login(input),
    onSuccess: (data) => {
      setSession(data.accessToken, data.user)
      router.replace(defaultRouteForRole(data.user.role))
    },
  })
}

export function useRegister() {
  const setSession = useAuthStore((s) => s.setSession)
  const router = useRouter()

  return useMutation({
    mutationFn: (input: RegisterInput) => authApi.register(input),
    onSuccess: (data) => {
      setSession(data.accessToken, data.user)
      router.replace(defaultRouteForRole(data.user.role))
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  const clearSession = useAuthStore((s) => s.clearSession)
  const router = useRouter()

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      clearSession()
      queryClient.clear()
      router.replace('/login')
    },
    onError: () => {
      clearSession()
      queryClient.clear()
      router.replace('/login')
    },
  })
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
  })
}

export function useResetPassword() {
  const router = useRouter()
  return useMutation({
    mutationFn: (input: { token: string; newPassword: string }) =>
      authApi.resetPassword(input.token, input.newPassword),
    onSuccess: () => router.push('/login'),
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (input: { currentPassword: string; newPassword: string }) =>
      authApi.changePassword(input),
  })
}
