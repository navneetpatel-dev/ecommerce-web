'use client'

import { useState } from 'react'
import { MapPin, Plus, Pencil, Trash2, Star } from 'lucide-react'
import type { Address } from '@/shared/api/types'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { EmptyState } from '@/shared/components/EmptyState'
import { Skeleton } from '@/shared/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import {
  useAccountAddresses,
  useCreateAccountAddress,
  useUpdateAccountAddress,
  useDeleteAccountAddress,
  useSetDefaultAccountAddress,
} from '../../api/account.queries'
import type { AddressInput } from '@/features/users/api/users.api'

type FormState = {
  line1: string
  line2: string
  city: string
  state: string
  country: string
  pincode: string
  isDefault: boolean
}

function toFormState(addr?: Address | null): FormState {
  if (!addr) {
    return {
      line1: '',
      line2: '',
      city: '',
      state: '',
      country: 'India',
      pincode: '',
      isDefault: false,
    }
  }
  return {
    line1: addr.line1,
    line2: addr.line2 ?? '',
    city: addr.city,
    state: addr.state,
    country: addr.country,
    pincode: addr.pincode,
    isDefault: addr.isDefault,
  }
}

function toInput(form: FormState, hasAddresses: boolean): AddressInput {
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

export function AddressesSection() {
  const { data: addresses, isLoading } = useAccountAddresses()
  const createAddress = useCreateAccountAddress()
  const updateAddress = useUpdateAccountAddress()
  const deleteAddress = useDeleteAccountAddress()
  const setDefault = useSetDefaultAccountAddress()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Address | null>(null)
  const [form, setForm] = useState<FormState>(toFormState())
  const [formError, setFormError] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Address | null>(null)
  const [listError, setListError] = useState<string | null>(null)
  const [defaultingId, setDefaultingId] = useState<string | null>(null)

  const list = addresses ?? []
  const hasAddresses = list.length > 0
  const saving = createAddress.isPending || updateAddress.isPending

  const openCreate = () => {
    setEditing(null)
    setForm(toFormState())
    setFormError(null)
    setDialogOpen(true)
  }

  const openEdit = (addr: Address) => {
    setEditing(addr)
    setForm(toFormState(addr))
    setFormError(null)
    setDialogOpen(true)
  }

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!form.line1.trim() || !form.city.trim() || !form.state.trim() || !form.pincode.trim()) {
      setFormError('Please fill all required fields.')
      return
    }
    setFormError(null)
    const body = toInput(form, hasAddresses)
    try {
      if (editing) {
        await updateAddress.mutateAsync({ addressId: editing.id, body })
      } else {
        await createAddress.mutateAsync(body)
      }
      setDialogOpen(false)
    } catch (err) {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: string }).message)
          : 'Could not save address.'
      setFormError(message)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[0.875rem] text-ink-muted">
          {hasAddresses
            ? `${list.length} saved ${list.length === 1 ? 'address' : 'addresses'}`
            : 'No addresses yet'}
        </p>
        <Button type="button" variant="outline" onClick={openCreate} className="gap-2">
          <Plus size={16} />
          Add address
        </Button>
      </div>

      {!hasAddresses ? (
        <div className="border border-dashed border-line bg-paper/50">
          <EmptyState
            icon={MapPin}
            heading="Add a delivery address"
            message="Save where orders should arrive so checkout stays quick."
            actionLabel="Add address"
            onAction={openCreate}
            className="py-12 md:py-14"
          />
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {list.map((addr) => (
            <li
              key={addr.id}
              className="flex flex-col border border-line bg-surface p-4 shadow-elevation-1"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium text-ink">
                  {addr.line1}
                  {addr.line2 ? `, ${addr.line2}` : ''}
                </p>
                <p className="mt-1 text-[0.875rem] text-ink-muted">
                  {addr.city}, {addr.state} {addr.pincode}
                </p>
                <p className="mt-0.5 text-[0.8125rem] text-ink-muted">{addr.country}</p>
                {addr.isDefault ? (
                  <span className="mt-3 inline-block text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-brand">
                    Default
                  </span>
                ) : null}
              </div>
              <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => openEdit(addr)}
                >
                  <Pencil size={14} />
                  Edit
                </Button>
                {!addr.isDefault ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="gap-1.5"
                    loading={defaultingId === addr.id && setDefault.isPending}
                    onClick={async () => {
                      setListError(null)
                      setDefaultingId(addr.id)
                      try {
                        await setDefault.mutateAsync(addr.id)
                      } catch (err) {
                        setListError(
                          err && typeof err === 'object' && 'message' in err
                            ? String((err as { message: string }).message)
                            : 'Could not set default address.'
                        )
                      } finally {
                        setDefaultingId(null)
                      }
                    }}
                  >
                    <Star size={14} />
                    Set default
                  </Button>
                ) : null}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-danger hover:text-danger"
                  onClick={() => setDeleteTarget(addr)}
                >
                  <Trash2 size={14} />
                  Delete
                </Button>
              </div>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={openCreate}
              className="flex h-full min-h-[10rem] w-full flex-col items-center justify-center gap-2 border border-dashed border-line bg-paper/40 p-4 text-ink-muted transition-colors hover:border-ink/30 hover:bg-paper hover:text-ink"
            >
              <Plus size={20} strokeWidth={1.5} />
              <span className="text-[0.875rem] font-medium">Add address</span>
            </button>
          </li>
        </ul>
      )}

      {listError ? (
        <p role="alert" className="text-[0.875rem] text-danger">
          {listError}
        </p>
      ) : null}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit address' : 'New address'}</DialogTitle>
            <DialogDescription>
              All fields marked required must be filled.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="acct-addr-line1">Address line 1</Label>
              <Input
                id="acct-addr-line1"
                value={form.line1}
                onChange={(e) => setForm((f) => ({ ...f, line1: e.target.value }))}
                placeholder="House no., street, landmark"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="acct-addr-line2">Address line 2 (optional)</Label>
              <Input
                id="acct-addr-line2"
                value={form.line2}
                onChange={(e) => setForm((f) => ({ ...f, line2: e.target.value }))}
                placeholder="Apartment, suite, floor"
              />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="acct-addr-city">City</Label>
                <Input
                  id="acct-addr-city"
                  value={form.city}
                  onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="acct-addr-state">State</Label>
                <Input
                  id="acct-addr-state"
                  value={form.state}
                  onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="acct-addr-pincode">Pincode</Label>
                <Input
                  id="acct-addr-pincode"
                  value={form.pincode}
                  onChange={(e) => setForm((f) => ({ ...f, pincode: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="acct-addr-country">Country</Label>
                <Input
                  id="acct-addr-country"
                  value={form.country}
                  onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                />
              </div>
            </div>
            {(hasAddresses || editing) && (
              <label className="flex items-center gap-2 text-[0.875rem] text-ink">
                <input
                  type="checkbox"
                  checked={form.isDefault}
                  onChange={(e) => setForm((f) => ({ ...f, isDefault: e.target.checked }))}
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
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" loading={saving}>
                Save address
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete address?</DialogTitle>
            <DialogDescription>
              This removes the address from your account. You can add it again later.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              loading={deleteAddress.isPending}
              onClick={async () => {
                if (!deleteTarget) return
                setListError(null)
                try {
                  await deleteAddress.mutateAsync(deleteTarget.id)
                  setDeleteTarget(null)
                } catch (err) {
                  setDeleteTarget(null)
                  setListError(
                    err && typeof err === 'object' && 'message' in err
                      ? String((err as { message: string }).message)
                      : 'Could not delete address.'
                  )
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
