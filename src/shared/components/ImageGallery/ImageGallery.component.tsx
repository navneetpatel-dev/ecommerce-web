"use client";

import dynamic from "next/dynamic";
import type { ProductImage } from "@/shared/api/types";
import { MediaImage } from "@/shared/components/MediaImage.component";
import { ImageGalleryThumbnailStrip } from "@/shared/components/ImageGalleryThumbnailStrip.component";
import { LABELS } from "@/shared/constants/labels";
import {
  IMAGE_GALLERY_STAGE_HEIGHT_CLASS,
  IMAGE_GALLERY_STAGE_OBJECT_FIT_CLASS,
  IMAGE_GALLERY_STAGE_QUALITY,
  IMAGE_GALLERY_STAGE_SIZES,
  IMAGE_GALLERY_THUMB_COLUMN_HEIGHT_CLASS,
} from "@/shared/constants/imageGallery";
import { cn } from "@/shared/utils/cn";
import { formatLabel } from "@/shared/utils/formatLabel";
import { useGalleryStage } from "./useGalleryStage.hook";
import { imageGalleryStyles as styles } from "./imageGallery.styles";
import { ImageStageControls } from "./ImageStageControls.component";

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
  /** Pointer handlers from `useImageGalleryZoom` (hover-zoom + swipe). */
  zoomHandlers: Parameters<typeof useGalleryStage>[0]["zoomHandlers"];
  lightboxOpen: boolean;
  onOpenLightbox: () => void;
  onCloseLightbox: () => void;
}

/** Rendered only while the lightbox is open (portal overlay): no skeleton needed. */
const ImageGalleryLightbox = dynamic(
  () =>
    import("@/shared/components/ImageGalleryLightbox.component").then(
      (mod) => mod.ImageGalleryLightbox,
    ),
  { loading: () => null },
);

export function ImageGallery(props: ImageGalleryProps) {
  const {
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
  } = props;

  const stage = useGalleryStage({
    mainImageUrl,
    images,
    selectedIndex,
    prevIndex,
    zooming,
    zoomOrigin,
    zoomHandlers,
  });
  const {
    gallery,
    safeIndex,
    currentUrl,
    prevUrl,
    hasMultiple,
    showZoom,
    reduceMotion,
  } = stage;
  const currentTransitionClass = reduceMotion
    ? ""
    : "transition-opacity duration-[var(--motion-base)]";

  const goPrev = () => {
    if (!hasMultiple) return;
    onSelect((safeIndex - 1 + gallery.length) % gallery.length);
  };

  const goNext = () => {
    if (!hasMultiple) return;
    onSelect((safeIndex + 1) % gallery.length);
  };

  const stopStageClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
  };

  const handleLightboxOpenChange = (open: boolean) => {
    if (open) onOpenLightbox();
    else onCloseLightbox();
  };

  return (
    <div className={styles.root}>
      <div className={styles.layoutRow}>
        {hasMultiple ? (
          <ImageGalleryThumbnailStrip
            images={gallery}
            selectedIndex={safeIndex}
            onSelect={onSelect}
            productName={productName}
            orientation="responsive"
            className={cn(
              styles.thumbColumn,
              IMAGE_GALLERY_THUMB_COLUMN_HEIGHT_CLASS,
            )}
            thumbClassName={cn(styles.thumbSquare, styles.thumbSquareDesktop)}
          />
        ) : null}

        <div className="group relative order-1 min-w-0 flex-1 lg:order-2">
          <div
            onClick={onOpenLightbox}
            {...zoomHandlers}
            className={cn(
              styles.stageBase,
              "shadow-elevation-1",
              IMAGE_GALLERY_STAGE_HEIGHT_CLASS,
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
                    currentTransitionClass,
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
                style={stage.zoomOverlayStyle}
              />
            ) : null}

            {hasMultiple ? (
              <p className={styles.positionBadge}>
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
        onOpenChange={handleLightboxOpenChange}
        images={gallery}
        selectedIndex={safeIndex}
        onSelect={onSelect}
        productName={productName}
      />
    </div>
  );
}
