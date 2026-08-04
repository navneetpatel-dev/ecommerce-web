import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { subOrdersApi } from '@/features/orders/api/orders.api'

export function useVendorOrderManagement() {
  const [page] = useState(1)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['vendor', 'suborders', page],
    queryFn: () => subOrdersApi.vendorSubOrders(page),
  })

  const updateStatus = useMutation({
    mutationFn: (input: { id: string; status: string; trackingId?: string }) =>
      subOrdersApi.updateStatus(input.id, { status: input.status, trackingId: input.trackingId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vendor', 'suborders'] }),
  })

  const handleStatusChange = (id: string, status: string) => {
    updateStatus.mutate({ id, status })
    setUpdatingId(null)
  }

  return { data, isLoading, updatingId, setUpdatingId, handleStatusChange, isPending: updateStatus.isPending }
}
