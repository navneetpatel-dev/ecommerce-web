"use client";

import { Trash2, Star } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { FileUpload } from "@/shared/components/FileUpload";
import { MediaImage } from "@/shared/components/media/MediaImage.component";
import { LABELS } from "@/shared/constants/labels";
import {
  UPLOAD_ENTITY,
  UPLOAD_PURPOSE,
} from "@/shared/constants/uploads/uploads";
import type { ProductImage, ProductVariant } from "@/shared/api/types";
import { productImageRowStyles } from "../../../styles/products/vendorProductImagesDialog.styles";

interface ProductImageRowProps {
  image: ProductImage;
  variants: ProductVariant[];
  productId: string;
  busyId: string | null;
  /** The listing's only image, which cannot be removed while it is on sale. */
  keepsLast?: boolean;
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
    keepsLast = false,
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
    <li className={productImageRowStyles.card}>
      <div className={productImageRowStyles.media}>
        <MediaImage
          src={image.url}
          alt=""
          sizes="(min-width: 640px) 360px, 100vw"
          imageClassName={productImageRowStyles.mediaImg}
        />
        {image.isPrimary ? (
          <span className={productImageRowStyles.mainBadge}>
            <Star className={productImageRowStyles.starIcon} aria-hidden />
            {LABELS.primaryImage}
          </span>
        ) : null}
      </div>
      <div className={productImageRowStyles.body}>
        <div className={productImageRowStyles.meta}>
          <p className={productImageRowStyles.metaText}>
            {variantSku
              ? `${LABELS.sku}: ${variantSku}`
              : LABELS.productImageAllVariants}
          </p>
        </div>
        <div className={productImageRowStyles.actions}>
          {image.isPrimary ? null : (
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
          <Button
            size="sm"
            variant="ghost"
            type="button"
            className={productImageRowStyles.actionsSpacer}
            aria-label={LABELS.deleteImage}
            disabled={isBusy || keepsLast}
            onClick={handleDelete}
          >
            <Trash2 aria-hidden />
            {LABELS.delete}
          </Button>
        </div>
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
    </li>
  );
}
