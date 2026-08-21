"use client";

import { useCallback, useEffect, useState } from "react";
import { Trash2, Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { FileUpload } from "@/shared/components/FileUpload";
import { MediaImage } from "@/shared/components/MediaImage";
import { FormSection } from "@/shared/components/forms";
import { LABELS } from "@/shared/constants/labels";
import { UPLOAD_ENTITY, UPLOAD_PURPOSE } from "@/shared/constants/uploads";
import { productsApi } from "@/features/products/api/products.api";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import type { ProductImage, ProductVariant } from "@/shared/api/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

interface VendorProductImagesDialogProps {
  productId: string;
  productName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChanged?: () => void;
}

export function VendorProductImagesDialog({
  productId,
  productName,
  open,
  onOpenChange,
  onChanged,
}: VendorProductImagesDialogProps) {
  const [images, setImages] = useState<ProductImage[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [variantId, setVariantId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const product = await productsApi.detail(productId);
      setImages(product.images ?? []);
      setVariants(product.variants ?? []);
    } catch (err) {
      setError(getApiErrorMessage(err, LABELS.couldNotLoadProduct));
      setImages([]);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    if (!open) return;
    void load();
  }, [open, load]);

  const onAddImage = async (url: string) => {
    setBusyId("new");
    try {
      await productsApi.addImage(productId, {
        url,
        isPrimary: images.length === 0,
        variantId: variantId || null,
      });
      await load();
      onChanged?.();
    } catch (err) {
      setError(getApiErrorMessage(err, LABELS.couldNotSaveProductImages));
    } finally {
      setBusyId(null);
    }
  };

  const onReplaceImage = async (imageId: string, url: string) => {
    setBusyId(imageId);
    try {
      await productsApi.replaceImage(imageId, { url });
      await load();
      onChanged?.();
    } catch (err) {
      setError(getApiErrorMessage(err, LABELS.couldNotSaveProductImages));
    } finally {
      setBusyId(null);
    }
  };

  const onDeleteImage = async (imageId: string) => {
    setBusyId(imageId);
    try {
      await productsApi.deleteImage(imageId);
      await load();
      onChanged?.();
    } catch (err) {
      setError(getApiErrorMessage(err, LABELS.couldNotSaveProductImages));
    } finally {
      setBusyId(null);
    }
  };

  const onSetPrimary = async (imageId: string) => {
    setBusyId(imageId);
    try {
      await productsApi.setPrimaryImage(imageId);
      await load();
      onChanged?.();
    } catch (err) {
      setError(getApiErrorMessage(err, LABELS.couldNotSaveProductImages));
    } finally {
      setBusyId(null);
    }
  };

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
              <div className="relative h-20 w-20 shrink-0 overflow-hidden border border-line bg-paper">
                <MediaImage
                  src={image.url}
                  alt=""
                  sizes="80px"
                  imageClassName="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1 space-y-2">
                {image.isPrimary ? (
                  <p className="text-[0.75rem] font-medium text-brand">
                    {LABELS.primaryImage}
                  </p>
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
                {image.variantId ? (
                  <p className="text-[0.75rem] text-ink-muted">
                    {LABELS.sku}:{" "}
                    {variants.find((variant) => variant.id === image.variantId)
                      ?.sku ?? image.variantId}
                  </p>
                ) : (
                  <p className="text-[0.75rem] text-ink-muted">
                    {LABELS.productImageAllVariants}
                  </p>
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

        <FormSection
          title={LABELS.productFormSectionImages}
          hint={LABELS.productFormSectionImagesHint}
          columns={1}
        >
          {variants.length > 0 ? (
            <Select
              value={variantId || "__all__"}
              onValueChange={(value) =>
                setVariantId(value === "__all__" ? "" : value)
              }
            >
              <SelectTrigger aria-label={LABELS.productImageVariant}>
                <SelectValue placeholder={LABELS.productImageAllVariants} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">
                  {LABELS.productImageAllVariants}
                </SelectItem>
                {variants.map((variant) => (
                  <SelectItem key={variant.id} value={variant.id}>
                    {variant.sku}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : null}
          <FileUpload
            entityType={UPLOAD_ENTITY.PRODUCTS}
            entityId={productId}
            purpose={UPLOAD_PURPOSE.IMAGES}
            accept="image/png,image/jpeg,image/webp"
            disabled={busyId === "new"}
            label={LABELS.addProductImage}
            onUploaded={(url) => void onAddImage(url)}
          />
        </FormSection>
      </DialogContent>
    </Dialog>
  );
}
