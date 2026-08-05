import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useAuthStore, defaultRouteForRole } from '../store/auth.store'
import { authApi } from './auth.api'
import { navigate, navigateReplace } from '@/shared/utils/navigate'
import type { LoginInput, RegisterInput } from '../schemas/auth.schema'
import type { RoleName } from '@/shared/api/types'

function postAuthPath(role: RoleName, redirect?: string | null) {
  if (redirect && redirect.startsWith('/') && !redirect.startsWith('//')) {
    return redirect
  }
  return defaultRouteForRole(role)
}

export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession)
  const router = useRouter()

  return useMutation({
    mutationFn: ({ redirect: _redirect, ...input }: LoginInput & { redirect?: string | null }) =>
      authApi.login(input),
    onSuccess: (data, variables) => {
      setSession(data.accessToken, data.user)
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', data.accessToken)
        localStorage.setItem('session', JSON.stringify(data.user))
      }
      navigateReplace(router, postAuthPath(data.user.role, variables.redirect))
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
      navigateReplace(router, defaultRouteForRole(data.user.role))
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
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('session')
      }
      queryClient.clear()
      navigateReplace(router, '/login')
    },
    onError: () => {
      clearSession()
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('session')
      }
      queryClient.clear()
      navigateReplace(router, '/login')
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
    onSuccess: () => navigate(router, '/login'),
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (input: { currentPassword: string; newPassword: string }) =>
      authApi.changePassword(input),
  })
}
