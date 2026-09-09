import { ImageGalleryContainer } from "@/shared/containers/media/ImageGalleryContainer.container";
import type { ProductDetail, ProductVariant } from "@/shared/api/types";

interface ProductGalleryProps {
  product: ProductDetail;
  resolvedVariant: ProductVariant | null;
  selectedImage: number;
  onSelect: (index: number) => void;
}

export function ProductGallery({
  product,
  resolvedVariant,
  selectedImage,
  onSelect,
}: ProductGalleryProps) {
  const galleryImages = (product.images ?? []).filter(
    (image) => !image.variantId || image.variantId === resolvedVariant?.id,
  );
  const selectedGalleryIndex =
    galleryImages.length === 0
      ? 0
      : Math.min(selectedImage, galleryImages.length - 1);

  return (
    <ImageGalleryContainer
      mainImageUrl={galleryImages[0]?.url || product.imageUrl}
      images={galleryImages}
      selectedIndex={selectedGalleryIndex}
      onSelect={onSelect}
      productName={product.name}
    />
  );
}
