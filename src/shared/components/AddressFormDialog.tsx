'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import type { AddressInput } from '@/features/users/api/users.api'
import type { Address } from '@/shared/api/types'

type AddressFormState = {
  line1: string
  line2: string
  city: string
  state: string
  country: string
  pincode: string
  isDefault: boolean
}

function toFormState(address?: Address | null): AddressFormState {
  return {
    line1: address?.line1 ?? '',
    line2: address?.line2 ?? '',
    city: address?.city ?? '',
    state: address?.state ?? '',
    country: address?.country ?? 'India',
    pincode: address?.pincode ?? '',
    isDefault: address?.isDefault ?? false,
  }
}

function toInput(form: AddressFormState, hasAddresses: boolean): AddressInput {
  return {
    line1: form.line1.trim(),
    line2: form.line2.trim() || null,
    city: form.city.trim(),
    state: form.state.trim(),
    country: form.country.trim() || 'India',
    pincode: form.pincode.trim(),
    isDefault: form.isDefault || !hasAddresses,
  }
}

interface AddressFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (body: AddressInput) => Promise<void>
  isPending?: boolean
  address?: Address | null
  hasAddresses: boolean
  title?: string
  description?: string
  submitLabel?: string
}

export function AddressFormDialog({
  open,
  onOpenChange,
  onSubmit,
  isPending = false,
  address,
  hasAddresses,
  title,
  description,
  submitLabel = 'Save address',
}: AddressFormDialogProps) {
  const [form, setForm] = useState<AddressFormState>(toFormState(address))
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setForm(toFormState(address))
      setFormError(null)
    }
  }, [address, open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title ?? (address ? 'Edit address' : 'New address')}</DialogTitle>
          <DialogDescription>
            {description ?? 'All fields marked required must be filled.'}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={async (event) => {
            event.preventDefault()
            if (!form.line1.trim() || !form.city.trim() || !form.state.trim() || !form.pincode.trim()) {
              setFormError('Please fill all required fields.')
              return
            }

            setFormError(null)

            try {
              await onSubmit(toInput(form, hasAddresses))
              onOpenChange(false)
            } catch (err) {
              const message =
                err && typeof err === 'object' && 'message' in err
                  ? String((err as { message: string }).message)
                  : 'Could not save address.'
              setFormError(message)
            }
          }}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <Label htmlFor="shared-addr-line1">Address line 1</Label>
            <Input
              id="shared-addr-line1"
              value={form.line1}
              onChange={(e) => setForm((prev) => ({ ...prev, line1: e.target.value }))}
              placeholder="House no., street, landmark"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="shared-addr-line2">Address line 2 (optional)</Label>
            <Input
              id="shared-addr-line2"
              value={form.line2}
              onChange={(e) => setForm((prev) => ({ ...prev, line2: e.target.value }))}
              placeholder="Apartment, suite, floor"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="shared-addr-city">City</Label>
              <Input
                id="shared-addr-city"
                value={form.city}
                onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="shared-addr-state">State</Label>
              <Input
                id="shared-addr-state"
                value={form.state}
                onChange={(e) => setForm((prev) => ({ ...prev, state: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="shared-addr-pincode">Pincode</Label>
              <Input
                id="shared-addr-pincode"
                value={form.pincode}
                onChange={(e) => setForm((prev) => ({ ...prev, pincode: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="shared-addr-country">Country</Label>
              <Input
                id="shared-addr-country"
                value={form.country}
                onChange={(e) => setForm((prev) => ({ ...prev, country: e.target.value }))}
              />
            </div>
          </div>

          {(hasAddresses || address) && (
            <label className="flex items-center gap-2 text-[0.875rem] text-ink">
              <input
                type="checkbox"
                checked={form.isDefault}
                onChange={(e) => setForm((prev) => ({ ...prev, isDefault: e.target.checked }))}
                className="h-4 w-4 accent-[var(--brand)]"
              />
              Set as default address
            </label>
          )}

          {formError ? (
            <p role="alert" className="text-[0.875rem] text-danger">
              {formError}
            </p>
          ) : null}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={isPending}>
              {submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
