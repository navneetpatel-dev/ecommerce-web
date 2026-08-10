'use client'

import { useState } from 'react'
import { ArrowRight, MapPin, Plus } from 'lucide-react'
import type { Address } from '@/shared/api/types'
import { Button } from '@/shared/components/ui/button'
import { AddressFormDialog } from '@/shared/components/AddressFormDialog'
import { DisabledActionHint } from '@/shared/components/DisabledActionHint'
import { LABELS } from '@/shared/constants/labels'
import { cn } from '@/shared/utils/cn'

interface AddressStepProps {
  addresses?: Address[]
  selectedId: string | null
  isCreating?: boolean
  onSelect: (id: string) => void
  onContinue: () => void
  onCreateAddress: (body: Omit<Address, 'id' | 'userId'>) => Promise<void>
}

export function AddressStep({
  addresses,
  selectedId,
  isCreating,
  onSelect,
  onContinue,
  onCreateAddress,
}: AddressStepProps) {
  const [showDialog, setShowDialog] = useState(false)
  const hasAddresses = Boolean(addresses?.length)

  return (
    <div className="space-y-5">
      {hasAddresses && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[0.875rem] text-ink-muted">
            {addresses!.length} saved {addresses!.length === 1 ? 'address' : 'addresses'}
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setShowDialog(true)
            }}
            className="gap-2"
          >
            <Plus size={16} />
            Add address
          </Button>
        </div>
      )}

      {!hasAddresses && !showDialog && (
        <div className="flex flex-col items-start gap-5 border border-dashed border-line bg-paper/50 px-6 py-10 md:px-8 md:py-12">
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-surface text-brand">
            <MapPin size={22} />
          </span>
          <div>
            <p className="font-display text-[1.25rem] text-ink">Add a delivery address</p>
            <p className="mt-2 max-w-[40ch] text-[0.9375rem] leading-relaxed text-ink-muted">
              Save where your order should arrive so checkout stays quick next time.
            </p>
          </div>
          <Button type="button" size="lg" onClick={() => setShowDialog(true)} className="gap-2">
            <Plus size={16} />
            Add address
          </Button>
        </div>
      )}

      <AddressFormDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        hasAddresses={hasAddresses}
        isPending={isCreating}
        title={LABELS.newAddress}
        onSubmit={onCreateAddress}
      />

      {hasAddresses && (
        <ul className="space-y-3">
          {addresses!.map((addr) => {
            const selected = selectedId === addr.id
            return (
              <li key={addr.id}>
                <button
                  type="button"
                  onClick={() => onSelect(addr.id)}
                  className={cn(
                    'w-full border px-4 py-4 text-left transition-colors',
                    selected
                      ? 'border-brand bg-brand-subtle shadow-[inset_3px_0_0_0_var(--brand)]'
                      : 'border-line bg-surface hover:border-ink/25'
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-ink">
                        {addr.line1}
                        {addr.line2 ? `, ${addr.line2}` : ''}
                      </p>
                      <p className="mt-1 text-[0.875rem] text-ink-muted">
                        {addr.city}, {addr.state} {addr.pincode}
                      </p>
                      <p className="mt-0.5 text-[0.8125rem] text-ink-muted">{addr.country}</p>
                    </div>
                    <span
                      className={cn(
                        'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border',
                        selected ? 'border-brand bg-brand' : 'border-line bg-surface'
                      )}
                      aria-hidden
                    >
                      {selected && <span className="h-1.5 w-1.5 rounded-full bg-paper" />}
                    </span>
                  </div>
                  {addr.isDefault && (
                    <span className="mt-3 inline-block text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-brand">
                      Default
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      )}

      <DisabledActionHint
        disabled={!selectedId}
        message={
          !hasAddresses
            ? 'Add a delivery address to continue.'
            : 'Select a delivery address to continue.'
        }
        className="w-full sm:w-auto"
      >
        <Button
          size="lg"
          onClick={onContinue}
          disabled={!selectedId}
          fullWidth="mobile"
          className="gap-2"
        >
          Continue to shipping
          <ArrowRight size={16} />
        </Button>
      </DisabledActionHint>
    </div>
  )
}
