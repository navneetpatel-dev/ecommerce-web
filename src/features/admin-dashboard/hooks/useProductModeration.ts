import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '../api/admin.api'

export function useProductModeration() {
  const queryClient = useQueryClient()
  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const [rejectNote, setRejectNote] = useState('')

  const approve = useMutation({
    mutationFn: (id: string) => adminApi.approveProduct(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'products'] }),
  })

  const reject = useMutation({
    mutationFn: ({ id, note }: { id: string; note: string }) => adminApi.rejectProduct(id, note),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'products'] }); setRejectingId(null); setRejectNote('') },
  })

  const startReject = (id: string) => { setRejectingId(id); setRejectNote('') }
  const cancelReject = () => setRejectingId(null)
  const submitReject = (id: string) => reject.mutate({ id, note: rejectNote })

  return { rejectingId, rejectNote, setRejectNote, approve, startReject, cancelReject, submitReject }
}
