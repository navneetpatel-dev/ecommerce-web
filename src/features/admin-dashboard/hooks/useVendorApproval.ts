import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '../api/admin.api'

export function useVendorApproval() {
  const queryClient = useQueryClient()
  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')

  const approve = useMutation({
    mutationFn: (id: string) => adminApi.approveVendor(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'vendors'] }),
  })

  const reject = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => adminApi.rejectVendor(id, reason),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'vendors'] }); setRejectingId(null); setRejectReason('') },
  })

  const startReject = (id: string) => { setRejectingId(id); setRejectReason('') }
  const cancelReject = () => setRejectingId(null)
  const submitReject = (id: string) => reject.mutate({ id, reason: rejectReason })

  return { rejectingId, rejectReason, setRejectReason, approve, reject, startReject, cancelReject, submitReject }
}
