'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { VendorRegisterSchema, type VendorRegisterInput } from '../schemas/vendor.schema'
import { useVendorRegistration } from '../hooks/useVendorRegistration'
import { VendorRegisterForm } from '../components/VendorRegisterForm'

export function VendorRegisterPage() {
  const register = useVendorRegistration()
  const form = useForm<VendorRegisterInput>({
    resolver: zodResolver(VendorRegisterSchema),
  })

  return (
    <VendorRegisterForm
      form={form}
      onSubmit={(data) => register.mutate(data)}
      error={register.isError}
      isPending={register.isPending}
    />
  )
}
