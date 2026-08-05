'use client'

import { useState } from 'react'
import type { Address } from '@/shared/api/types'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'

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
      isDefault: form.isDefault || !(addresses?.length),
    })
    setForm(emptyForm)
    setShowForm(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[1.375rem] font-semibold text-ink">Select delivery address</h2>
        <Button type="button" variant="outline" size="sm" onClick={() => setShowForm((v) => !v)}>
          {showForm ? 'Cancel' : 'Add address'}
        </Button>
      </div>

      {addresses?.length === 0 && !showForm && (
        <p className="text-[0.9375rem] text-ink-muted">No saved addresses. Add one to continue.</p>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-3 rounded-md border border-line bg-surface p-4">
          <div className="space-y-1.5">
            <Label htmlFor="addr-line1">Address line 1</Label>
            <Input
              id="addr-line1"
              value={form.line1}
              onChange={(e) => setForm((f) => ({ ...f, line1: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="addr-line2">Address line 2 (optional)</Label>
            <Input
              id="addr-line2"
              value={form.line2}
              onChange={(e) => setForm((f) => ({ ...f, line2: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
          <Button type="submit" loading={isCreating}>
            Save address
          </Button>
        </form>
      )}

      {addresses?.map((addr) => (
        <Card
          key={addr.id}
          className={`cursor-pointer transition-colors ${selectedId === addr.id ? 'border-brand bg-brand-subtle' : ''}`}
          onClick={() => {
            onSelect(addr.id)
            onContinue()
          }}
        >
          <CardContent className="py-4">
            <p className="font-medium">
              {addr.line1}
              {addr.line2 ? `, ${addr.line2}` : ''}
            </p>
            <p className="text-[0.9375rem] text-ink-muted">
              {addr.city}, {addr.state} {addr.pincode}
            </p>
            {addr.isDefault && <span className="text-[0.8125rem] text-brand font-medium">Default</span>}
          </CardContent>
        </Card>
      ))}

      <Button onClick={onContinue} disabled={!selectedId}>
        Continue
      </Button>
    </div>
  )
}
