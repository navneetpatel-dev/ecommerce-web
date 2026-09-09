"use client";

import dynamic from "next/dynamic";
import type { ProductImage } from "@/shared/api/types";
import { ImageGalleryThumbnailStrip } from "@/shared/components/ImageGalleryThumbnailStrip.component";
import { IMAGE_GALLERY_THUMB_COLUMN_HEIGHT_CLASS } from "@/shared/constants/media/imageGallery";
import { cn } from "@/shared/utils/dom/cn";
import { useGalleryStage } from "../../hooks/image-gallery/useGalleryStage.hook";
import { imageGalleryStyles as styles } from "../../styles/image-gallery/imageGallery.styles";
import { ImageGalleryStage } from "./ImageGalleryStage.component";

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

        <ImageGalleryStage
          currentUrl={currentUrl}
          prevUrl={prevUrl}
          transitioning={transitioning}
          currentTransitionClass={currentTransitionClass}
          productName={productName}
          showZoom={showZoom}
          zoomOverlayStyle={stage.zoomOverlayStyle}
          zoomHandlers={zoomHandlers}
          hasMultiple={hasMultiple}
          safeIndex={safeIndex}
          galleryLength={gallery.length}
          onOpenLightbox={onOpenLightbox}
          onPrev={goPrev}
          onNext={goNext}
        />
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
