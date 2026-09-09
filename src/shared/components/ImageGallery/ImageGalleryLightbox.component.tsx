"use client";

import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { MediaImage } from "@/shared/components/MediaImage.component";
import { ImageGalleryThumbnailStrip } from "@/shared/components/ImageGalleryThumbnailStrip.component";
import { LABELS } from "@/shared/constants/labels";
import {
  IMAGE_GALLERY_LIGHTBOX_QUALITY,
  IMAGE_GALLERY_LIGHTBOX_SIZES,
} from "@/shared/constants/media/imageGallery";
import { useImageLightboxGestures } from "@/shared/hooks/media/useImageLightboxGestures.hook";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { imageLightboxStyles } from "./imageLightbox.styles";
import type { ProductImage } from "@/shared/api/types";

interface ImageGalleryLightboxProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  images: ProductImage[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  productName: string;
}

export function ImageGalleryLightbox({
  open,
  onOpenChange,
  images,
  selectedIndex,
  onSelect,
  productName,
}: ImageGalleryLightboxProps) {
  const count = images.length;
  const safeIndex = Math.min(
    Math.max(selectedIndex, 0),
    Math.max(count - 1, 0),
  );
  const current = images[safeIndex];
  const hasMultiple = count > 1;
  const viewportRef = useRef<HTMLDivElement>(null);

  const goPrev = () => {
    if (!hasMultiple) return;
    onSelect((safeIndex - 1 + count) % count);
  };

  const goNext = () => {
    if (!hasMultiple) return;
    onSelect((safeIndex + 1) % count);
  };

  const { transform, resetTransform, viewportHandlers } =
    useImageLightboxGestures({
      enabled: open,
      viewportRef,
      onSwipe: (direction) => {
        if (direction < 0) goPrev();
        else goNext();
      },
    });

  useEffect(() => {
    if (!open) resetTransform();
  }, [open, resetTransform]);

  useEffect(() => {
    if (!open) return;
    resetTransform();
  }, [safeIndex, open, resetTransform]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        presentation="fullscreen"
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            goPrev();
          }
          if (event.key === "ArrowRight") {
            event.preventDefault();
            goNext();
          }
        }}
      >
        <DialogTitle className={imageLightboxStyles.titleSrOnly}>
          {productName}
        </DialogTitle>
        <div className={imageLightboxStyles.modalContainer}>
          <div
            ref={viewportRef}
            {...viewportHandlers}
            className={imageLightboxStyles.viewport}
          >
            <div
              className={imageLightboxStyles.transformLayer}
              style={{
                transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${transform.scale})`,
              }}
            >
              <div className={imageLightboxStyles.imageWrapper}>
                <MediaImage
                  src={current?.url}
                  alt={productName}
                  unavailableLabel={LABELS.imageNotAvailable}
                  sizes={IMAGE_GALLERY_LIGHTBOX_SIZES}
                  quality={IMAGE_GALLERY_LIGHTBOX_QUALITY}
                  imageClassName={imageLightboxStyles.imageFit}
                />
              </div>
            </div>

            {hasMultiple ? (
              <>
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  onClick={goPrev}
                  aria-label={LABELS.previousImage}
                  className={imageLightboxStyles.navPrevButton}
                >
                  <ChevronLeft
                    className={imageLightboxStyles.navIcon}
                    strokeWidth={1.75}
                  />
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  onClick={goNext}
                  aria-label={LABELS.nextImage}
                  className={imageLightboxStyles.navNextButton}
                >
                  <ChevronRight
                    className={imageLightboxStyles.navIcon}
                    strokeWidth={1.75}
                  />
                </Button>
                <p className={imageLightboxStyles.counterBadge}>
                  {formatLabel(LABELS.imagePosition, {
                    current: safeIndex + 1,
                    total: count,
                  })}
                </p>
              </>
            ) : null}
          </div>

          {hasMultiple ? (
            <ImageGalleryThumbnailStrip
              images={images}
              selectedIndex={safeIndex}
              onSelect={onSelect}
              productName={productName}
              orientation="horizontal"
              className={imageLightboxStyles.thumbnailStrip}
              thumbClassName={imageLightboxStyles.thumbnailThumb}
            />
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
