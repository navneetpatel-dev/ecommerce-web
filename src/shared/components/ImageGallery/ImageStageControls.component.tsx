"use client";

import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import type { MouseEvent } from "react";

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

  const prevButtonClass =
    "absolute left-2.5 top-1/2 z-[2] h-10 w-10 min-h-10 max-h-10 -translate-y-1/2 rounded-full border border-line bg-surface/90 shadow-elevation-1 backdrop-blur-sm sm:left-3 sm:h-11 sm:w-11 sm:min-h-11 sm:max-h-11 opacity-100 lg:opacity-0 lg:transition-opacity lg:group-hover:opacity-100";
  const nextButtonClass =
    "absolute right-2.5 top-1/2 z-[2] h-10 w-10 min-h-10 max-h-10 -translate-y-1/2 rounded-full border border-line bg-surface/90 shadow-elevation-1 backdrop-blur-sm sm:right-3 sm:h-11 sm:w-11 sm:min-h-11 sm:max-h-11 opacity-100 lg:opacity-0 lg:transition-opacity lg:group-hover:opacity-100";

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        size="icon-sm"
        onClick={handleZoom}
        aria-label={LABELS.viewLargerImage}
        className="absolute right-2.5 top-2.5 z-[2] h-10 w-10 min-h-10 max-h-10 rounded-full border border-line bg-surface/90 shadow-elevation-1 backdrop-blur-sm sm:right-3 sm:top-3 sm:h-11 sm:w-11 sm:min-h-11 sm:max-h-11"
      >
        <Maximize2 className="h-4 w-4" strokeWidth={1.75} />
      </Button>

      {hasMultiple ? (
        <>
          <Button
            type="button"
            variant="secondary"
            size="icon-sm"
            onClick={handlePrev}
            aria-label={LABELS.previousImage}
            className={prevButtonClass}
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="icon-sm"
            onClick={handleNext}
            aria-label={LABELS.nextImage}
            className={nextButtonClass}
          >
            <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
          </Button>
        </>
      ) : null}
    </>
  );
}
