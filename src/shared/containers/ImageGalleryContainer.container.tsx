"use client";

import { useState } from "react";
import { useImageGalleryTransition } from "@/shared/hooks/useImageGalleryTransition.hook";
import { useImageGalleryZoom } from "@/shared/hooks/useImageGalleryZoom.hook";
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
  const gallery = useImageGalleryTransition(selectedIndex, onSelect);
  const count = images?.length ? images.length : 1;
  const zoom = useImageGalleryZoom({
    enabled: !lightboxOpen,
    onTap: () => setLightboxOpen(true),
    onSwipe: (direction) => {
      if (count <= 1) return;
      const next = (selectedIndex + direction + count) % count;
      gallery.selectImage(next);
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
      onOpenLightbox={() => setLightboxOpen(true)}
      onCloseLightbox={() => setLightboxOpen(false)}
    />
  );
}
