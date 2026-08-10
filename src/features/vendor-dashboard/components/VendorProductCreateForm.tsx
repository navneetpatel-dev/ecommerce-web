'use client'

import { Button } from '@/shared/components/ui/button'
import { FileUpload } from '@/shared/components/FileUpload'
import { FormActions, FormFieldFrame, FormSection, FormStack } from '@/shared/components/forms'
import { Input } from '@/shared/components/ui/input'
import { Textarea } from '@/shared/components/ui/textarea'
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
    <form className="mb-5" onSubmit={onSubmit}>
      <FormStack>
        <FormSection
          title={LABELS.productFormSectionDetails}
          hint={LABELS.productFormSectionDetailsHint}
        >
          <FormFieldFrame label={LABELS.productName} required>
            <Input
              placeholder={LABELS.productNamePlaceholder}
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              required
            />
          </FormFieldFrame>
          <FormFieldFrame label={LABELS.pricePlaceholder} required>
            <NumberInput
              prefix="₹"
              min={1}
              step={1}
              placeholder={LABELS.pricePlaceholder}
              value={price === '' ? undefined : Number(price)}
              onChange={(value) => onPriceChange(value == null ? '' : String(value))}
            />
          </FormFieldFrame>
          <FormFieldFrame label={LABELS.selectCategory} required>
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
          </FormFieldFrame>
          <FormFieldFrame label={LABELS.shortDescription}>
            <Textarea
              placeholder={LABELS.shortDescription}
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              className="min-h-[6.5rem]"
            />
          </FormFieldFrame>
        </FormSection>

        <FormSection
          title={LABELS.productFormSectionImages}
          hint={LABELS.productFormSectionImagesHint}
          columns={1}
        >
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
        </FormSection>

        {createError ? <p className="text-sm text-danger">{createError}</p> : null}

        <FormActions>
          <Button variant="outline" type="button" onClick={onCancel}>
            {LABELS.cancel}
          </Button>
          <Button type="submit" disabled={creating} loading={creating}>
            {creating ? LABELS.creatingEllipsis : LABELS.createProduct}
          </Button>
        </FormActions>
      </FormStack>
    </form>
  )
}
