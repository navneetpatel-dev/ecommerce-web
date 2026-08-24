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
} from "@/shared/constants/imageGallery";
import { useImageLightboxGestures } from "@/shared/hooks/useImageLightboxGestures.hook";
import { formatLabel } from "@/shared/utils/formatLabel";
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
        <DialogTitle className="sr-only">{productName}</DialogTitle>
        <div className="flex h-full min-h-0 w-full flex-col bg-paper">
          <div
            ref={viewportRef}
            {...viewportHandlers}
            className="relative h-0 min-h-0 flex-1 touch-none overflow-hidden bg-paper"
          >
            <div
              className="absolute inset-0 will-change-transform"
              style={{
                transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${transform.scale})`,
              }}
            >
              <div className="relative h-full w-full">
                <MediaImage
                  src={current?.url}
                  alt={productName}
                  unavailableLabel={LABELS.imageNotAvailable}
                  sizes={IMAGE_GALLERY_LIGHTBOX_SIZES}
                  quality={IMAGE_GALLERY_LIGHTBOX_QUALITY}
                  imageClassName="object-contain"
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
                  className="absolute left-2 top-1/2 z-[2] hidden h-10 w-10 min-h-10 max-h-10 -translate-y-1/2 rounded-full border border-line bg-surface/90 shadow-elevation-1 backdrop-blur-sm sm:left-3 sm:flex sm:h-11 sm:w-11 sm:min-h-11 sm:max-h-11"
                >
                  <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  onClick={goNext}
                  aria-label={LABELS.nextImage}
                  className="absolute right-2 top-1/2 z-[2] hidden h-10 w-10 min-h-10 max-h-10 -translate-y-1/2 rounded-full border border-line bg-surface/90 shadow-elevation-1 backdrop-blur-sm sm:right-3 sm:flex sm:h-11 sm:w-11 sm:min-h-11 sm:max-h-11"
                >
                  <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
                </Button>
                <p className="pointer-events-none absolute bottom-3 left-1/2 z-[2] -translate-x-1/2 rounded-full bg-surface/90 px-2.5 py-1 text-[0.75rem] tabular-nums text-ink-muted backdrop-blur-sm sm:bottom-4">
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
              className="w-full min-w-0 shrink-0 border-t border-line bg-surface/95 px-3 py-2.5 backdrop-blur-sm sm:px-4 sm:py-3"
              thumbClassName="h-12 w-12 min-h-12 max-h-none sm:h-14 sm:w-14 sm:min-h-14 sm:max-h-none"
            />
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
