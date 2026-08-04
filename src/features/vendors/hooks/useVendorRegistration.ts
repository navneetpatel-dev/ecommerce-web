import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { vendorsApi } from '../api/vendors.api'
import type { VendorRegisterInput } from '../schemas/vendor.schema'

export function useVendorRegistration() {
  const router = useRouter()

  return useMutation({
    mutationFn: (body: VendorRegisterInput) =>
      vendorsApi.register({ ...body, bankDetails: {} }),
    onSuccess: () => router.push('/vendor/dashboard/overview'),
  })
}
