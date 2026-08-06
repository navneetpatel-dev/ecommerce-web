import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useAuthStore, defaultRouteForRole } from '../store/auth.store'
import { authApi } from './auth.api'
import { cartApi } from '@/features/cart/api/cart.api'
import { clearClientGuestSessionCookie } from '@/features/cart/utils/guest-session'
import { navigate, navigateReplace } from '@/shared/utils/navigate'
import { PATHS } from '@/shared/constants/paths'
import type { LoginInput, RegisterInput } from '../schemas/auth.schema'
import type { RoleName } from '@/shared/api/types'

function postAuthPath(role: RoleName, redirect?: string | null) {
  if (redirect && redirect.startsWith('/') && !redirect.startsWith('//')) {
    return redirect
  }
  return defaultRouteForRole(role)
}

async function absorbGuestCartAfterAuth(accessToken: string) {
  // Token must be in the store before the merge request is authorized.
  useAuthStore.getState().setAccessToken(accessToken)
  try {
    const cart = await cartApi.mergeGuest()
    clearClientGuestSessionCookie()
    return cart
  } catch {
    // Non-fatal: next authenticated cart GET still absorbs any leftover guest cart.
    return null
  }
}

export const sessionKeys = {
  all: ['auth', 'sessions'] as const,
}

export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession)
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: ({ redirect: _redirect, ...input }: LoginInput & { redirect?: string | null }) =>
      authApi.login(input),
    onSuccess: async (data, variables) => {
      setSession(data.accessToken, data.user)
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', data.accessToken)
        localStorage.setItem('session', JSON.stringify(data.user))
      }
      const cart = await absorbGuestCartAfterAuth(data.accessToken)
      if (cart) {
        queryClient.setQueryData(['cart'], cart)
      } else {
        void queryClient.invalidateQueries({ queryKey: ['cart'] })
      }
      navigateReplace(router, postAuthPath(data.user.role, variables.redirect))
    },
  })
}

export function useRegister() {
  const setSession = useAuthStore((s) => s.setSession)
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: (input: RegisterInput) => authApi.register(input),
    onSuccess: async (data) => {
      setSession(data.accessToken, data.user)
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', data.accessToken)
        localStorage.setItem('session', JSON.stringify(data.user))
      }
      const cart = await absorbGuestCartAfterAuth(data.accessToken)
      if (cart) {
        queryClient.setQueryData(['cart'], cart)
      } else {
        void queryClient.invalidateQueries({ queryKey: ['cart'] })
      }
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
      clearClientGuestSessionCookie()
      queryClient.clear()
      navigateReplace(router, PATHS.login)
    },
    onError: () => {
      clearSession()
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('session')
      }
      clearClientGuestSessionCookie()
      queryClient.clear()
      navigateReplace(router, PATHS.login)
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
    onSuccess: () => navigate(router, PATHS.login),
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (input: { currentPassword: string; newPassword: string }) =>
      authApi.changePassword(input),
  })
}

export function useSessions() {
  const accessToken = useAuthStore((s) => s.accessToken)
  return useQuery({
    queryKey: sessionKeys.all,
    queryFn: () => authApi.listSessions(),
    enabled: Boolean(accessToken),
  })
}

export function useRevokeSession() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (family: string) => authApi.revokeSession(family),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: sessionKeys.all })
    },
  })
}

export function useRevokeOtherSessions() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => authApi.revokeOtherSessions(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: sessionKeys.all })
    },
  })
}
