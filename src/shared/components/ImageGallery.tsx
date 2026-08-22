"use client";

import { useEffect, type CSSProperties, type MouseEvent } from "react";
import dynamic from "next/dynamic";
import { useReducedMotion } from "motion/react";
import type { ProductImage } from "@/shared/api/types";
import { MediaImage } from "@/shared/components/MediaImage";
import { ImageGalleryThumbnailStrip } from "@/shared/components/ImageGalleryThumbnailStrip";
import { LABELS } from "@/shared/constants/labels";
import {
  IMAGE_GALLERY_STAGE_HEIGHT_CLASS,
  IMAGE_GALLERY_STAGE_OBJECT_FIT_CLASS,
  IMAGE_GALLERY_STAGE_QUALITY,
  IMAGE_GALLERY_STAGE_SIZES,
  IMAGE_GALLERY_THUMB_COLUMN_HEIGHT_CLASS,
  IMAGE_GALLERY_ZOOM_SCALE,
} from "@/shared/constants/imageGallery";
import { cn } from "@/shared/utils/cn";
import { formatLabel } from "@/shared/utils/formatLabel";
import type { useImageGalleryZoom } from "@/shared/hooks/useImageGalleryZoom";
import { ImageStageControls } from "./ImageGallery/ImageStageControls";

type ZoomHandlers = ReturnType<typeof useImageGalleryZoom>["stageHandlers"];

interface ImageGalleryProps {
  mainImageUrl: string;
  images?: ProductImage[];
  selectedIndex: number;
  prevIndex: number;
  transitioning: boolean;
  onSelect: (index: number) => void;
  productName: string;
  zooming: boolean;
  zoomOrigin: { x: number; y: number };
  zoomHandlers: ZoomHandlers;
  lightboxOpen: boolean;
  onOpenLightbox: () => void;
  onCloseLightbox: () => void;
}

const STAGE_HEIGHT_CLASS = IMAGE_GALLERY_STAGE_HEIGHT_CLASS;
const THUMB_COLUMN_HEIGHT_CLASS = IMAGE_GALLERY_THUMB_COLUMN_HEIGHT_CLASS;

/** Rendered only while the lightbox is open (portal overlay), so no skeleton fallback is needed. */
const ImageGalleryLightbox = dynamic(
  () =>
    import("@/shared/components/ImageGalleryLightbox").then(
      (mod) => mod.ImageGalleryLightbox,
    ),
  { loading: () => null },
);

function cssUrl(value: string) {
  return `url(${JSON.stringify(value)})`;
}

export function ImageGallery({
  mainImageUrl,
  images,
  selectedIndex,
  prevIndex,
  transitioning,
  onSelect,
  productName,
  zooming,
  zoomOrigin,
  zoomHandlers,
  lightboxOpen,
  onOpenLightbox,
  onCloseLightbox,
}: ImageGalleryProps) {
  const reduceMotion = useReducedMotion();
  const gallery = images?.length
    ? images
    : [{ id: "main", url: mainImageUrl, isPrimary: true }];
  const safeIndex = Math.min(
    Math.max(selectedIndex, 0),
    Math.max(gallery.length - 1, 0),
  );
  const currentUrl = gallery[safeIndex]?.url || mainImageUrl;
  const prevUrl = gallery[prevIndex]?.url || mainImageUrl;
  const hasMultiple = gallery.length > 1;
  const showZoom = Boolean(zooming && !reduceMotion && currentUrl);

  useEffect(() => {
    if (!currentUrl || typeof window === "undefined") return;
    const preload = new window.Image();
    preload.decoding = "async";
    preload.src = currentUrl;
  }, [currentUrl]);

  const zoomOverlayStyle: CSSProperties | undefined = showZoom
    ? {
        backgroundImage: cssUrl(currentUrl),
        backgroundRepeat: "no-repeat",
        backgroundSize: `${IMAGE_GALLERY_ZOOM_SCALE * 100}%`,
        backgroundPosition: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
      }
    : undefined;

  const goPrev = () => {
    if (!hasMultiple) return;
    onSelect((safeIndex - 1 + gallery.length) % gallery.length);
  };

  const goNext = () => {
    if (!hasMultiple) return;
    onSelect((safeIndex + 1) % gallery.length);
  };

  const stopStageClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
  };

  return (
    <div className="min-w-0 md:col-span-6 lg:col-span-7 lg:sticky lg:top-[88px] lg:z-[1] lg:self-start">
      <div className="flex min-w-0 flex-col gap-2.5 sm:gap-3 lg:flex-row lg:items-stretch lg:gap-3.5">
        {hasMultiple ? (
          <ImageGalleryThumbnailStrip
            images={gallery}
            selectedIndex={safeIndex}
            onSelect={onSelect}
            productName={productName}
            orientation="responsive"
            className={cn(
              "order-2 w-full min-w-0 pb-0.5 lg:order-1 lg:w-[4.25rem] lg:shrink-0",
              THUMB_COLUMN_HEIGHT_CLASS,
            )}
            thumbClassName={cn(
              "h-14 w-14 min-h-14 max-h-none sm:h-16 sm:w-16 sm:min-h-16",
              "lg:h-[4.25rem] lg:w-[4.25rem] lg:min-h-[4.25rem] lg:max-h-none",
            )}
          />
        ) : null}

        <div className="group relative order-1 min-w-0 flex-1 lg:order-2">
          <div
            onClick={onOpenLightbox}
            {...zoomHandlers}
            className={cn(
              "relative w-full cursor-zoom-in overflow-hidden rounded-2xl border border-line bg-paper select-none touch-pan-y",
              "shadow-elevation-1",
              STAGE_HEIGHT_CLASS,
            )}
          >
            <div className="pointer-events-none absolute inset-0">
              <div className="relative h-full w-full">
                <MediaImage
                  src={currentUrl}
                  alt={showZoom ? LABELS.imageZoomPreview : productName}
                  unavailableLabel={LABELS.imageNotAvailable}
                  sizes={IMAGE_GALLERY_STAGE_SIZES}
                  quality={IMAGE_GALLERY_STAGE_QUALITY}
                  priority
                  imageClassName={cn(
                    IMAGE_GALLERY_STAGE_OBJECT_FIT_CLASS,
                    transitioning ? "opacity-0" : "opacity-100",
                    reduceMotion
                      ? ""
                      : "transition-opacity duration-[var(--motion-base)]",
                  )}
                />
                {transitioning ? (
                  <div className="absolute inset-0">
                    <MediaImage
                      src={prevUrl}
                      alt={productName}
                      unavailableLabel={LABELS.imageNotAvailable}
                      sizes={IMAGE_GALLERY_STAGE_SIZES}
                      quality={IMAGE_GALLERY_STAGE_QUALITY}
                      imageClassName={IMAGE_GALLERY_STAGE_OBJECT_FIT_CLASS}
                    />
                  </div>
                ) : null}
              </div>
            </div>

            {showZoom ? (
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-[1]"
                style={zoomOverlayStyle}
              />
            ) : null}

            {hasMultiple ? (
              <p className="pointer-events-none absolute left-2.5 top-2.5 z-[2] rounded-full border border-line bg-surface/90 px-2.5 py-1 text-[0.75rem] tabular-nums text-ink-muted backdrop-blur-sm sm:left-3 sm:top-3">
                {formatLabel(LABELS.imagePosition, {
                  current: safeIndex + 1,
                  total: gallery.length,
                })}
              </p>
            ) : null}

            <ImageStageControls
              hasMultiple={hasMultiple}
              onOpenLightbox={onOpenLightbox}
              onPrev={goPrev}
              onNext={goNext}
              stopStageClick={stopStageClick}
            />
          </div>
        </div>
      </div>

      <ImageGalleryLightbox
        open={lightboxOpen}
        onOpenChange={(open) => {
          if (open) onOpenLightbox();
          else onCloseLightbox();
        }}
        images={gallery}
        selectedIndex={safeIndex}
        onSelect={onSelect}
        productName={productName}
      />
    </div>
  );
}
