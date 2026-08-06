import type { FormEvent } from 'react'
import { Button } from '@/shared/components/ui/button'

interface AdminShippingZoneFormProps {
  name: string
  onNameChange: (value: string) => void
  onSubmit: (e: FormEvent) => void
}

export function AdminShippingZoneForm({ name, onNameChange, onSubmit }: AdminShippingZoneFormProps) {
  return (
    <form
      className="flex flex-wrap gap-2 border border-line p-4"
      onSubmit={onSubmit}
    >
      <input
        className="border border-line px-3 py-2"
        placeholder="Zone name"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        required
      />
      <Button type="submit">Add shipping zone</Button>
    </form>
  )
}
