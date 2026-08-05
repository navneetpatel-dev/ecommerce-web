import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Textarea } from '@/shared/components/ui/textarea'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/components/ui/card'
import { UseFormReturn } from 'react-hook-form'

interface VendorRegisterInput {
  businessName: string
  description?: string
  gstNumber?: string
}

interface VendorRegisterFormProps {
  form: UseFormReturn<VendorRegisterInput>
  onSubmit: (data: VendorRegisterInput) => void
  error: boolean
  isPending: boolean
}

export function VendorRegisterForm({ form, onSubmit, error, isPending }: VendorRegisterFormProps) {
  const { register, handleSubmit, formState: { errors } } = form

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-display">Register as a Vendor</CardTitle>
          <CardDescription>Start selling on the marketplace</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input id="businessName" {...register('businessName')} />
              {errors.businessName && <p className="text-[0.9375rem] text-danger">{errors.businessName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea id="description" {...register('description')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gstNumber">GST Number (optional)</Label>
              <Input id="gstNumber" {...register('gstNumber')} />
            </div>
            {error && <p className="text-[0.9375rem] text-danger">Registration failed. Try again.</p>}
            <Button type="submit" className="w-full" loading={isPending}>Register as Vendor</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
