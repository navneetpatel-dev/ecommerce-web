'use client'

import { useState } from 'react'
import { ArrowRight, MapPin, Plus } from 'lucide-react'
import type { Address } from '@/shared/api/types'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { DisabledActionHint } from '@/shared/components/DisabledActionHint'
import { cn } from '@/shared/utils/cn'

interface AddressStepProps {
  addresses?: Address[]
  selectedId: string | null
  isCreating?: boolean
  onSelect: (id: string) => void
  onContinue: () => void
  onCreateAddress: (body: Omit<Address, 'id' | 'userId'>) => void
}

const emptyForm = {
  line1: '',
  line2: '',
  city: '',
  state: '',
  country: 'India',
  pincode: '',
  isDefault: true,
}

export function AddressStep({
  addresses,
  selectedId,
  isCreating,
  onSelect,
  onContinue,
  onCreateAddress,
}: AddressStepProps) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const hasAddresses = Boolean(addresses?.length)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!form.line1.trim() || !form.city.trim() || !form.state.trim() || !form.pincode.trim()) return
    onCreateAddress({
      line1: form.line1.trim(),
      line2: form.line2.trim() || null,
      city: form.city.trim(),
      state: form.state.trim(),
      country: form.country.trim() || 'India',
      pincode: form.pincode.trim(),
      isDefault: form.isDefault || !hasAddresses,
    })
    setForm(emptyForm)
    setShowForm(false)
  }

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
            onClick={() => setShowForm((v) => !v)}
            className="gap-2"
          >
            {showForm ? (
              'Cancel'
            ) : (
              <>
                <Plus size={16} />
                Add address
              </>
            )}
          </Button>
        </div>
      )}

      {!hasAddresses && !showForm && (
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
          <Button type="button" size="lg" onClick={() => setShowForm(true)} className="gap-2">
            <Plus size={16} />
            Add address
          </Button>
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 border border-line bg-surface-raised p-5 shadow-elevation-1"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-display text-[1.125rem] text-ink">New address</p>
              <p className="mt-1 text-[0.8125rem] text-ink-muted">
                All fields marked required must be filled.
              </p>
            </div>
            {!hasAddresses && (
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="addr-line1">Address line 1</Label>
            <Input
              id="addr-line1"
              value={form.line1}
              onChange={(e) => setForm((f) => ({ ...f, line1: e.target.value }))}
              placeholder="House no., street, landmark"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="addr-line2">Address line 2 (optional)</Label>
            <Input
              id="addr-line2"
              value={form.line2}
              onChange={(e) => setForm((f) => ({ ...f, line2: e.target.value }))}
              placeholder="Apartment, suite, floor"
            />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="addr-city">City</Label>
              <Input
                id="addr-city"
                value={form.city}
                onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="addr-state">State</Label>
              <Input
                id="addr-state"
                value={form.state}
                onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="addr-pincode">Pincode</Label>
              <Input
                id="addr-pincode"
                value={form.pincode}
                onChange={(e) => setForm((f) => ({ ...f, pincode: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="addr-country">Country</Label>
              <Input
                id="addr-country"
                value={form.country}
                onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
              />
            </div>
          </div>
          <Button type="submit" loading={isCreating} className="w-full sm:w-auto">
            Save address
          </Button>
        </form>
      )}

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
          className="w-full gap-2 sm:w-auto"
        >
          Continue to shipping
          <ArrowRight size={16} />
        </Button>
      </DisabledActionHint>
    </div>
  )
}
