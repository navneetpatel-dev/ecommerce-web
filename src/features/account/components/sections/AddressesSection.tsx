'use client'

import { useState } from 'react'
import { MapPin, Plus, Pencil, Trash2, Star } from 'lucide-react'
import type { Address } from '@/shared/api/types'
import { Button } from '@/shared/components/ui/button'
import { EmptyState } from '@/shared/components/EmptyState'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { AddressFormDialog } from '@/shared/components/AddressFormDialog'
import { cn } from '@/shared/utils/cn'
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

export function AddressesSection() {
  const { data: addresses, isLoading } = useAccountAddresses()
  const createAddress = useCreateAccountAddress()
  const updateAddress = useUpdateAccountAddress()
  const deleteAddress = useDeleteAccountAddress()
  const setDefault = useSetDefaultAccountAddress()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Address | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Address | null>(null)
  const [listError, setListError] = useState<string | null>(null)
  const [defaultingId, setDefaultingId] = useState<string | null>(null)

  const list = addresses ?? []
  const hasAddresses = list.length > 0
  const saving = createAddress.isPending || updateAddress.isPending

  const openCreate = () => {
    setEditing(null)
    setDialogOpen(true)
  }

  const openEdit = (addr: Address) => {
    setEditing(addr)
    setDialogOpen(true)
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
              <div className="mt-4 grid grid-cols-3 gap-2 border-t border-line pt-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="w-full justify-center gap-1.5"
                  onClick={() => openEdit(addr)}
                >
                  <Pencil size={14} />
                  Edit
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={addr.isDefault || (defaultingId === addr.id && setDefault.isPending)}
                  className={cn(
                    'w-full justify-center gap-1.5 transition-colors',
                    addr.isDefault
                      ? 'text-brand hover:text-brand disabled:opacity-100'
                      : 'text-ink-muted hover:text-brand'
                  )}
                  loading={defaultingId === addr.id && setDefault.isPending}
                  onClick={async () => {
                    if (addr.isDefault) return
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
                  {addr.isDefault ? 'Default' : 'Set default'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="w-full justify-center gap-1.5 text-danger hover:text-danger"
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

      <AddressFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        address={editing}
        hasAddresses={hasAddresses}
        isPending={saving}
        onSubmit={async (body: AddressInput) => {
          if (editing) {
            await updateAddress.mutateAsync({ addressId: editing.id, body })
            return
          }
          await createAddress.mutateAsync(body)
        }}
      />

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
