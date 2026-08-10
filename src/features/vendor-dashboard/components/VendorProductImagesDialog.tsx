'use client'

import { useCallback, useEffect, useState } from 'react'
import { Trash2, Star } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { FileUpload } from '@/shared/components/FileUpload'
import { FormSection } from '@/shared/components/forms'
import { LABELS } from '@/shared/constants/labels'
import { UPLOAD_ENTITY, UPLOAD_PURPOSE } from '@/shared/constants/uploads'
import { productsApi } from '@/features/products/api/products.api'
import { getApiErrorMessage } from '@/shared/utils/apiErrorMessage'
import type { ProductImage } from '@/shared/api/types'

interface VendorProductImagesDialogProps {
  productId: string
  productName: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onChanged?: () => void
}

export function VendorProductImagesDialog({
  productId,
  productName,
  open,
  onOpenChange,
  onChanged,
}: VendorProductImagesDialogProps) {
  const [images, setImages] = useState<ProductImage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const product = await productsApi.detail(productId)
      setImages(product.images ?? [])
    } catch (err) {
      setError(getApiErrorMessage(err, LABELS.couldNotLoadProduct))
      setImages([])
    } finally {
      setLoading(false)
    }
  }, [productId])

  useEffect(() => {
    if (!open) return
    void load()
  }, [open, load])

  const onAddImage = async (url: string) => {
    setBusyId('new')
    try {
      await productsApi.addImage(productId, { url, isPrimary: images.length === 0 })
      await load()
      onChanged?.()
    } catch (err) {
      setError(getApiErrorMessage(err, LABELS.couldNotSaveProductImages))
    } finally {
      setBusyId(null)
    }
  }

  const onReplaceImage = async (imageId: string, url: string) => {
    setBusyId(imageId)
    try {
      await productsApi.replaceImage(imageId, { url })
      await load()
      onChanged?.()
    } catch (err) {
      setError(getApiErrorMessage(err, LABELS.couldNotSaveProductImages))
    } finally {
      setBusyId(null)
    }
  }

  const onDeleteImage = async (imageId: string) => {
    setBusyId(imageId)
    try {
      await productsApi.deleteImage(imageId)
      await load()
      onChanged?.()
    } catch (err) {
      setError(getApiErrorMessage(err, LABELS.couldNotSaveProductImages))
    } finally {
      setBusyId(null)
    }
  }

  const onSetPrimary = async (imageId: string) => {
    setBusyId(imageId)
    try {
      await productsApi.setPrimaryImage(imageId)
      await load()
      onChanged?.()
    } catch (err) {
      setError(getApiErrorMessage(err, LABELS.couldNotSaveProductImages))
    } finally {
      setBusyId(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{LABELS.manageProductImages}</DialogTitle>
          <DialogDescription>{productName}</DialogDescription>
        </DialogHeader>

        {loading ? <p className="text-ink-muted">{LABELS.loading}</p> : null}
        {error ? <p className="text-danger text-[0.8125rem]">{error}</p> : null}

        <ul className="space-y-3">
          {images.map((image) => (
            <li
              key={image.id}
              className="flex flex-col gap-2 rounded-md border border-line bg-surface p-3 sm:flex-row sm:items-start"
            >
              <div className="h-20 w-20 shrink-0 overflow-hidden border border-line bg-paper">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image.url} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0 flex-1 space-y-2">
                {image.isPrimary ? (
                  <p className="text-[0.75rem] font-medium text-brand">{LABELS.primaryImage}</p>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    type="button"
                    disabled={busyId === image.id}
                    onClick={() => void onSetPrimary(image.id)}
                  >
                    <Star className="mr-1 size-3.5" aria-hidden />
                    {LABELS.setPrimaryImage}
                  </Button>
                )}
                <FileUpload
                  entityType={UPLOAD_ENTITY.PRODUCTS}
                  entityId={productId}
                  purpose={UPLOAD_PURPOSE.IMAGES}
                  accept="image/png,image/jpeg,image/webp"
                  disabled={busyId === image.id}
                  label={LABELS.replaceImage}
                  onUploaded={(url) => void onReplaceImage(image.id, url)}
                />
              </div>
              <Button
                size="icon-sm"
                variant="ghost"
                type="button"
                aria-label={LABELS.deleteImage}
                disabled={busyId === image.id}
                onClick={() => void onDeleteImage(image.id)}
              >
                <Trash2 aria-hidden />
              </Button>
            </li>
          ))}
        </ul>

        <FormSection title={LABELS.productFormSectionImages} hint={LABELS.productFormSectionImagesHint} columns={1}>
          <FileUpload
            entityType={UPLOAD_ENTITY.PRODUCTS}
            entityId={productId}
            purpose={UPLOAD_PURPOSE.IMAGES}
            accept="image/png,image/jpeg,image/webp"
            disabled={busyId === 'new'}
            label={LABELS.addProductImage}
            onUploaded={(url) => void onAddImage(url)}
          />
        </FormSection>
      </DialogContent>
    </Dialog>
  )
}
