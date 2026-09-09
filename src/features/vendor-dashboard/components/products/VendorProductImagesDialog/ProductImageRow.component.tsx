"use client";

import { Trash2, Star } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { FileUpload } from "@/shared/components/FileUpload.component";
import { MediaImage } from "@/shared/components/MediaImage.component";
import { LABELS } from "@/shared/constants/labels";
import { UPLOAD_ENTITY, UPLOAD_PURPOSE } from "@/shared/constants/uploads/uploads";
import type { ProductImage, ProductVariant } from "@/shared/api/types";
import { productImageRowStyles } from "./vendorProductImagesDialog.styles";

interface ProductImageRowProps {
  image: ProductImage;
  variants: ProductVariant[];
  productId: string;
  busyId: string | null;
  onReplaceImage: (imageId: string, url: string) => void;
  onDeleteImage: (imageId: string) => void;
  onSetPrimary: (imageId: string) => void;
}

/** One product image row in the manage-images dialog (Rule 3 split). */
export function ProductImageRow(props: ProductImageRowProps) {
  const {
    image,
    variants,
    productId,
    busyId,
    onReplaceImage,
    onDeleteImage,
    onSetPrimary,
  } = props;
  const isBusy = busyId === image.id;

  const variantSku = image.variantId
    ? (variants.find((variant) => variant.id === image.variantId)?.sku ??
      image.variantId)
    : null;

  const handleReplace = (url: string) => {
    onReplaceImage(image.id, url);
  };

  const handleDelete = () => {
    onDeleteImage(image.id);
  };

  const handleSetPrimary = () => {
    onSetPrimary(image.id);
  };

  return (
    <li className={productImageRowStyles.row}>
      <div className={productImageRowStyles.thumbnailWrapper}>
        <MediaImage
          src={image.url}
          alt=""
          sizes="80px"
          imageClassName={productImageRowStyles.thumbnailImg}
        />
      </div>
      <div className={productImageRowStyles.contentCol}>
        {image.isPrimary ? (
          <p className={productImageRowStyles.primaryBadgeText}>
            {LABELS.primaryImage}
          </p>
        ) : (
          <Button
            size="sm"
            variant="outline"
            type="button"
            disabled={isBusy}
            onClick={handleSetPrimary}
          >
            <Star className={productImageRowStyles.starIcon} aria-hidden />
            {LABELS.setPrimaryImage}
          </Button>
        )}
        {variantSku ? (
          <p className={productImageRowStyles.skuText}>
            {LABELS.sku}: {variantSku}
          </p>
        ) : (
          <p className={productImageRowStyles.skuText}>
            {LABELS.productImageAllVariants}
          </p>
        )}
        <FileUpload
          entityType={UPLOAD_ENTITY.PRODUCTS}
          entityId={productId}
          purpose={UPLOAD_PURPOSE.IMAGES}
          accept="image/png,image/jpeg,image/webp"
          disabled={isBusy}
          label={LABELS.replaceImage}
          onUploaded={handleReplace}
        />
      </div>
      <Button
        size="icon-sm"
        variant="ghost"
        type="button"
        aria-label={LABELS.deleteImage}
        disabled={isBusy}
        onClick={handleDelete}
      >
        <Trash2 aria-hidden />
      </Button>
    </li>
  );
}
