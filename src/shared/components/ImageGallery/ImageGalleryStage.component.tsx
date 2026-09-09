import type { CSSProperties, MouseEvent } from "react";
import { MediaImage } from "@/shared/components/MediaImage.component";
import type { useGalleryStage } from "../../hooks/image-gallery/useGalleryStage.hook";
import { LABELS } from "@/shared/constants/labels";
import {
  IMAGE_GALLERY_STAGE_HEIGHT_CLASS,
  IMAGE_GALLERY_STAGE_OBJECT_FIT_CLASS,
  IMAGE_GALLERY_STAGE_QUALITY,
  IMAGE_GALLERY_STAGE_SIZES,
} from "@/shared/constants/media/imageGallery";
import { cn } from "@/shared/utils/dom/cn";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { imageGalleryStyles as styles } from "../../styles/image-gallery/imageGallery.styles";
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
    <div className={styles.stageWrapper}>
      <div
        onClick={onOpenLightbox}
        {...zoomHandlers}
        className={cn(
          styles.stageBase,
          styles.stageShadow,
          IMAGE_GALLERY_STAGE_HEIGHT_CLASS,
        )}
      >
        <div className={styles.mediaWrapper}>
          <div className={styles.mediaInner}>
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
              <div className={styles.transitionPrevWrapper}>
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
            className={styles.zoomOverlay}
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
