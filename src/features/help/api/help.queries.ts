import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { helpApi, type CreateHelpTicketBody } from './help.api'

export const helpKeys = {
  mine: ['help', 'tickets', 'mine'] as const,
}

export function useCreateHelpTicket() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: CreateHelpTicketBody) => helpApi.createTicket(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: helpKeys.mine })
    },
  })
}

export function useMyHelpTickets() {
  const accessToken = useAuthStore((s) => s.accessToken)
  return useQuery({
    queryKey: helpKeys.mine,
    queryFn: () => helpApi.myTickets(),
    enabled: Boolean(accessToken),
  })
}
