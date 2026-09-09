"use client";

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
import { UPLOAD_ENTITY, UPLOAD_PURPOSE } from "@/shared/constants/uploads/uploads";
import type { ProductImage } from "@/shared/api/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { ProductImageRow } from "./VendorProductImagesDialog/ProductImageRow.component";
import { vendorProductImagesDialogStyles } from "./VendorProductImagesDialog/vendorProductImagesDialog.styles";
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
          <p className={vendorProductImagesDialogStyles.loadingText}>
            {LABELS.loading}
          </p>
        ) : null}
        {error ? (
          <p className={vendorProductImagesDialogStyles.errorText}>{error}</p>
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
