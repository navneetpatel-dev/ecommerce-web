import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { returnsApi, type CreateReturnBody } from './returns.api'

export const returnsKeys = {
  mine: ['returns', 'mine'] as const,
}

export function useMyReturns() {
  const accessToken = useAuthStore((s) => s.accessToken)
  return useQuery({
    queryKey: returnsKeys.mine,
    queryFn: () => returnsApi.list(),
    enabled: Boolean(accessToken),
  })
}

export function useCreateReturn() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: CreateReturnBody) => returnsApi.create(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: returnsKeys.mine })
    },
  })
}
