"use client";

import { galleryStep } from "@/shared/utils/media/galleryStep";
import { useState } from "react";
import { useImageGalleryTransition } from "@/shared/hooks/media/useImageGalleryTransition.hook";
import { useImageGalleryZoom } from "@/shared/hooks/media/useImageGalleryZoom.hook";
import { ImageGallery } from "@/shared/components/ImageGallery";
import type { ProductImage } from "@/shared/api/types";

interface ImageGalleryContainerProps {
  mainImageUrl: string;
  images?: ProductImage[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  productName: string;
}

export function ImageGalleryContainer({
  mainImageUrl,
  images,
  selectedIndex,
  onSelect,
  productName,
}: ImageGalleryContainerProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const openLightbox = () => setLightboxOpen(true);
  const closeLightbox = () => setLightboxOpen(false);
  const gallery = useImageGalleryTransition(selectedIndex, onSelect);
  const count = images?.length ? images.length : 1;
  const zoom = useImageGalleryZoom({
    enabled: !lightboxOpen,
    onTap: openLightbox,
    onSwipe: (direction) => {
      const next = galleryStep(selectedIndex, direction < 0 ? -1 : 1, count);
      if (next !== selectedIndex) gallery.selectImage(next);
    },
  });

  return (
    <ImageGallery
      mainImageUrl={mainImageUrl}
      images={images}
      selectedIndex={selectedIndex}
      prevIndex={gallery.prevIndex}
      transitioning={gallery.transitioning}
      onSelect={gallery.selectImage}
      productName={productName}
      zooming={zoom.zooming}
      zoomOrigin={zoom.origin}
      zoomHandlers={zoom.stageHandlers}
      lightboxOpen={lightboxOpen}
      onOpenLightbox={openLightbox}
      onCloseLightbox={closeLightbox}
    />
  );
}
