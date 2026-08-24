"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { FileUpload } from "@/shared/components/FileUpload.component";
import { FormSection } from "@/shared/components/forms";
import { LABELS } from "@/shared/constants/labels";
import { UPLOAD_ENTITY, UPLOAD_PURPOSE } from "@/shared/constants/uploads";
import { productsApi } from "@/features/products";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import type { ProductImage, ProductVariant } from "@/shared/api/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { ProductImageRow } from "./VendorProductImagesDialog/ProductImageRow.component";

interface VendorProductImagesDialogProps {
  productId: string;
  productName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChanged?: () => void;
}

const ALL_VARIANTS_VALUE = "__all__";

/** Manage product images: list, replace/delete, set primary, add new. */
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

  const runImageAction = async (
    busyKey: string,
    action: () => Promise<void>,
  ) => {
    setBusyId(busyKey);
    try {
      await action();
      await load();
      onChanged?.();
    } catch (err) {
      setError(getApiErrorMessage(err, LABELS.couldNotSaveProductImages));
    } finally {
      setBusyId(null);
    }
  };

  const onAddImage = (url: string) =>
    void runImageAction("new", async () => {
      await productsApi.addImage(productId, {
        url,
        isPrimary: images.length === 0,
        variantId: variantId || null,
      });
    });

  const onReplaceImage = (imageId: string, url: string) =>
    void runImageAction(imageId, async () => {
      await productsApi.replaceImage(imageId, { url });
    });

  const onDeleteImage = (imageId: string) =>
    void runImageAction(imageId, async () => {
      await productsApi.deleteImage(imageId);
    });

  const onSetPrimary = (imageId: string) =>
    void runImageAction(imageId, async () => {
      await productsApi.setPrimaryImage(imageId);
    });

  const handleVariantFilter = (value: string) => {
    setVariantId(value === ALL_VARIANTS_VALUE ? "" : value);
  };

  const renderImageRow = (image: ProductImage) => (
    <ProductImageRow
      key={image.id}
      image={image}
      variants={variants}
      productId={productId}
      busyId={busyId}
      onReplaceImage={onReplaceImage}
      onDeleteImage={onDeleteImage}
      onSetPrimary={onSetPrimary}
    />
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{LABELS.manageProductImages}</DialogTitle>
          <DialogDescription>{productName}</DialogDescription>
        </DialogHeader>

        {loading ? <p className="text-ink-muted">{LABELS.loading}</p> : null}
        {error ? <p className="text-danger text-body-sm">{error}</p> : null}

        <ul className="space-y-3">{images.map(renderImageRow)}</ul>

        <FormSection
          title={LABELS.productFormSectionImages}
          hint={LABELS.productFormSectionImagesHint}
          columns={1}
        >
          {variants.length > 0 ? (
            <Select
              value={variantId || ALL_VARIANTS_VALUE}
              onValueChange={handleVariantFilter}
            >
              <SelectTrigger aria-label={LABELS.productImageVariant}>
                <SelectValue placeholder={LABELS.productImageAllVariants} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_VARIANTS_VALUE}>
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
            onUploaded={onAddImage}
          />
        </FormSection>
      </DialogContent>
    </Dialog>
  );
}
