"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { FileUpload } from "@/shared/components/FileUpload";
import { FormSection } from "@/shared/components/forms";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { PRODUCT_FIELD_LIMITS } from "@/features/products";
import { LABELS } from "@/shared/constants/labels";
import {
  UPLOAD_ENTITY,
  UPLOAD_PURPOSE,
} from "@/shared/constants/uploads/uploads";
import type { ProductImage } from "@/shared/api/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { ProductImageRow } from "./VendorProductImagesDialog/ProductImageRow.component";
import { vendorProductImagesDialogStyles } from "../../styles/products/vendorProductImagesDialog.styles";
import {
  useVendorProductImages,
  ALL_VARIANTS_VALUE,
} from "../../hooks/products/useVendorProductImages.hook";

interface VendorProductImagesDialogProps {
  productId: string;
  productName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChanged?: () => void;
}

/** Manage product images: list, replace/delete, set primary, add new. */
export function VendorProductImagesDialog({
  productId,
  productName,
  open,
  onOpenChange,
  onChanged,
}: VendorProductImagesDialogProps) {
  const {
    images,
    variants,
    variantId,
    loading,
    error,
    busyId,
    onAddImage,
    onReplaceImage,
    onDeleteImage,
    onSetPrimary,
    handleVariantFilter,
  } = useVendorProductImages({ productId, open, onChanged });
  const IMAGES_MAX = PRODUCT_FIELD_LIMITS.IMAGES_MAX;
  const imagesFull = images.length >= IMAGES_MAX;

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
      <DialogContent className={vendorProductImagesDialogStyles.dialogContent}>
        <DialogHeader>
          <DialogTitle>{LABELS.manageProductImages}</DialogTitle>
          <DialogDescription>{productName}</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="space-y-3 py-2" data-testid="product-images-skeleton">
            <Skeleton className="h-16 w-full rounded-md" />
            <Skeleton className="h-16 w-full rounded-md" />
          </div>
        ) : (
          <>
            {error ? (
              <p
                role="alert"
                className={vendorProductImagesDialogStyles.errorText}
              >
                {error}
              </p>
            ) : null}

            <ul className={vendorProductImagesDialogStyles.imageList}>
              {images.map(renderImageRow)}
            </ul>

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
              <p
                className={vendorProductImagesDialogStyles.counter}
                aria-live="polite"
              >
                {imagesFull
                  ? formatLabel(LABELS.uploadLimitFull, { max: IMAGES_MAX })
                  : formatLabel(LABELS.imagesCount, {
                      count: images.length,
                      max: IMAGES_MAX,
                    })}
              </p>
              <FileUpload
                entityType={UPLOAD_ENTITY.PRODUCTS}
                entityId={productId}
                purpose={UPLOAD_PURPOSE.IMAGES}
                accept="image/png,image/jpeg,image/webp"
                disabled={busyId === "new" || imagesFull}
                label={LABELS.addProductImage}
                onUploaded={onAddImage}
              />
            </FormSection>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
