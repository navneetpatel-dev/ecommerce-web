'use client'

import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { NumberInput } from '@/shared/components/NumberInput'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { LABELS } from '@/shared/constants/labels'

interface VendorProductCreateFormProps {
  name: string
  price: string
  description: string
  categoryId: string
  categories: Array<{ id: string; name: string }>
  createError: string | null
  creating: boolean
  onNameChange: (v: string) => void
  onPriceChange: (v: string) => void
  onDescriptionChange: (v: string) => void
  onCategoryChange: (v: string) => void
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
}

export function VendorProductCreateForm({
  name,
  price,
  description,
  categoryId,
  categories,
  createError,
  creating,
  onNameChange,
  onPriceChange,
  onDescriptionChange,
  onCategoryChange,
  onSubmit,
  onCancel,
}: VendorProductCreateFormProps) {
  return (
    <form
      className="mb-5 grid gap-3 rounded-md border border-line bg-surface p-4 sm:grid-cols-2"
      onSubmit={onSubmit}
    >
      <Input
        placeholder="Product name"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        required
      />
      <NumberInput
        prefix="₹"
        min={1}
        step={1}
        placeholder="Price"
        value={price === '' ? undefined : Number(price)}
        onChange={(value) => onPriceChange(value == null ? '' : String(value))}
      />
      <Select value={categoryId || undefined} onValueChange={onCategoryChange}>
        <SelectTrigger>
          <SelectValue placeholder={LABELS.selectCategory} />
        </SelectTrigger>
        <SelectContent>
          {categories.map((cat) => (
            <SelectItem key={cat.id} value={cat.id}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        placeholder="Short description"
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
      />
      <div className="flex gap-2 sm:col-span-2">
        <Button type="submit" disabled={creating} loading={creating}>
          {creating ? 'Creating…' : 'Create product'}
        </Button>
        <Button variant="outline" type="button" onClick={onCancel}>
          {LABELS.cancel}
        </Button>
      </div>
      {createError ? <p className="text-sm text-danger sm:col-span-2">{createError}</p> : null}
    </form>
  )
}
