"use client";

import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import type { MouseEvent } from "react";
import { imageStageControlsStyles } from "../../styles/image-gallery/imageGallery.styles";

interface ImageStageControlsProps {
  hasMultiple: boolean;
  onOpenLightbox: () => void;
  onPrev: () => void;
  onNext: () => void;
  /** Stops the click from also triggering the stage's lightbox open. */
  stopStageClick: (event: MouseEvent<HTMLButtonElement>) => void;
}

/** Floating zoom / prev / next controls over the gallery stage (Rule 3 split). */
export function ImageStageControls(props: ImageStageControlsProps) {
  const { hasMultiple, onOpenLightbox, onPrev, onNext, stopStageClick } = props;

  const handleZoom = (event: MouseEvent<HTMLButtonElement>) => {
    stopStageClick(event);
    onOpenLightbox();
  };

  const handlePrev = (event: MouseEvent<HTMLButtonElement>) => {
    stopStageClick(event);
    onPrev();
  };

  const handleNext = (event: MouseEvent<HTMLButtonElement>) => {
    stopStageClick(event);
    onNext();
  };

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        size="icon-sm"
        onClick={handleZoom}
        aria-label={LABELS.viewLargerImage}
        className={imageStageControlsStyles.zoomButton}
      >
        <Maximize2
          className={imageStageControlsStyles.icon}
          strokeWidth={1.75}
        />
      </Button>

      {hasMultiple ? (
        <>
          <Button
            type="button"
            variant="secondary"
            size="icon-sm"
            onClick={handlePrev}
            aria-label={LABELS.previousImage}
            className={imageStageControlsStyles.prevButton}
          >
            <ChevronLeft
              className={imageStageControlsStyles.icon}
              strokeWidth={1.75}
            />
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="icon-sm"
            onClick={handleNext}
            aria-label={LABELS.nextImage}
            className={imageStageControlsStyles.nextButton}
          >
            <ChevronRight
              className={imageStageControlsStyles.icon}
              strokeWidth={1.75}
            />
          </Button>
        </>
      ) : null}
    </>
  );
}
