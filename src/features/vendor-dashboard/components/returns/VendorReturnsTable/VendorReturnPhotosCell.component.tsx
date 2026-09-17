"use client";

import { ImageGalleryLightbox } from "@/shared/components/ImageGalleryLightbox.component";
import { LABELS } from "@/shared/constants/labels";
import type { ProductImage } from "@/shared/api/types";
import { useVendorReturnPhotosCell } from "../../../hooks/returns/useVendorReturnPhotosCell.hook";
import { vendorReturnsTableStyles } from "../../../styles/returns/vendorReturnsTable.styles";

interface VendorReturnPhotosCellProps {
  images: ProductImage[];
  productName: string;
}

export function VendorReturnPhotosCell({
  images,
  productName,
}: VendorReturnPhotosCellProps) {
  const photos = useVendorReturnPhotosCell(images);

  if (photos.isEmpty) {
    return <span>{LABELS.emptyCell}</span>;
  }

  return (
    <>
      <button
        type="button"
        className={vendorReturnsTableStyles.photoButton}
        onClick={photos.handleOpen}
      >
        {LABELS.viewReturnPhotos}
      </button>
      <ImageGalleryLightbox
        open={photos.open}
        onOpenChange={photos.handleOpenChange}
        images={images}
        selectedIndex={photos.selectedIndex}
        onSelect={photos.handleSelect}
        productName={productName}
      />
    </>
  );
}
