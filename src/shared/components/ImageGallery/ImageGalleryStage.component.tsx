import type { CSSProperties, MouseEvent } from "react";
import { MediaImage } from "@/shared/components/MediaImage.component";
import type { useGalleryStage } from "./useGalleryStage.hook";
import { LABELS } from "@/shared/constants/labels";
import {
  IMAGE_GALLERY_STAGE_HEIGHT_CLASS,
  IMAGE_GALLERY_STAGE_OBJECT_FIT_CLASS,
  IMAGE_GALLERY_STAGE_QUALITY,
  IMAGE_GALLERY_STAGE_SIZES,
} from "@/shared/constants/imageGallery";
import { cn } from "@/shared/utils/cn";
import { formatLabel } from "@/shared/utils/formatLabel";
import { imageGalleryStyles as styles } from "./imageGallery.styles";
import { ImageStageControls } from "./ImageStageControls.component";

interface ImageGalleryStageProps {
  currentUrl: string;
  prevUrl: string;
  transitioning: boolean;
  currentTransitionClass: string;
  productName: string;
  showZoom: boolean;
  zoomOverlayStyle?: CSSProperties;
  zoomHandlers: Parameters<typeof useGalleryStage>[0]["zoomHandlers"];
  hasMultiple: boolean;
  safeIndex: number;
  galleryLength: number;
  onOpenLightbox: () => void;
  onPrev: () => void;
  onNext: () => void;
}

/** The main enlarged-image stage: current/previous image crossfade, zoom overlay, nav controls. */
export function ImageGalleryStage({
  currentUrl,
  prevUrl,
  transitioning,
  currentTransitionClass,
  productName,
  showZoom,
  zoomOverlayStyle,
  zoomHandlers,
  hasMultiple,
  safeIndex,
  galleryLength,
  onOpenLightbox,
  onPrev,
  onNext,
}: ImageGalleryStageProps) {
  const stopStageClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
  };

  return (
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
            style={zoomOverlayStyle}
          />
        ) : null}

        {hasMultiple ? (
          <p className={styles.positionBadge}>
            {formatLabel(LABELS.imagePosition, {
              current: safeIndex + 1,
              total: galleryLength,
            })}
          </p>
        ) : null}

        <ImageStageControls
          hasMultiple={hasMultiple}
          onOpenLightbox={onOpenLightbox}
          onPrev={onPrev}
          onNext={onNext}
          stopStageClick={stopStageClick}
        />
      </div>
    </div>
  );
}
