'use client'

import { Button } from '@/shared/components/ui/button'
import { FileUpload } from '@/shared/components/FileUpload'
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
import { UPLOAD_ENTITY, UPLOAD_PURPOSE } from '@/shared/constants/uploads'

interface VendorProductCreateFormProps {
  name: string
  price: string
  description: string
  categoryId: string
  categories: Array<{ id: string; name: string }>
  imageUrls: string[]
  draftUploadId: string
  createError: string | null
  creating: boolean
  onNameChange: (v: string) => void
  onPriceChange: (v: string) => void
  onDescriptionChange: (v: string) => void
  onCategoryChange: (v: string) => void
  onImageUrlsChange: (urls: string[]) => void
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
}

export function VendorProductCreateForm({
  name,
  price,
  description,
  categoryId,
  categories,
  imageUrls,
  draftUploadId,
  createError,
  creating,
  onNameChange,
  onPriceChange,
  onDescriptionChange,
  onCategoryChange,
  onImageUrlsChange,
  onSubmit,
  onCancel,
}: VendorProductCreateFormProps) {
  return (
    <form
      className="mb-5 grid gap-3 rounded-md border border-line bg-surface p-4 sm:grid-cols-2"
      onSubmit={onSubmit}
    >
      <Input
        placeholder={LABELS.productNamePlaceholder}
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        required
      />
      <NumberInput
        prefix="₹"
        min={1}
        step={1}
        placeholder={LABELS.pricePlaceholder}
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
        placeholder={LABELS.shortDescription}
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
      />
      <div className="sm:col-span-2">
        <FileUpload
          mode="multiple"
          entityType={UPLOAD_ENTITY.PRODUCTS}
          entityId={draftUploadId}
          purpose={UPLOAD_PURPOSE.IMAGES}
          accept="image/png,image/jpeg,image/webp"
          valueUrls={imageUrls}
          onUploaded={onImageUrlsChange}
          label={LABELS.productImagesLabel}
          disabled={creating}
        />
      </div>
      <div className="flex gap-2 sm:col-span-2">
        <Button type="submit" disabled={creating} loading={creating}>
          {creating ? LABELS.creatingEllipsis : LABELS.createProduct}
        </Button>
        <Button variant="outline" type="button" onClick={onCancel}>
          {LABELS.cancel}
        </Button>
      </div>
      {createError ? <p className="text-sm text-danger sm:col-span-2">{createError}</p> : null}
    </form>
  )
}
