import type { FormEvent } from 'react'
import { Button } from '@/shared/components/ui/button'

interface AdminCategoryCreateFormProps {
  name: string
  onNameChange: (value: string) => void
  onSubmit: (e: FormEvent) => void
}

export function AdminCategoryCreateForm({ name, onNameChange, onSubmit }: AdminCategoryCreateFormProps) {
  return (
    <form className="flex gap-2" onSubmit={onSubmit}>
      <input
        className="border border-line px-3 py-2"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="New category"
      />
      <Button type="submit">Create</Button>
    </form>
  )
}
