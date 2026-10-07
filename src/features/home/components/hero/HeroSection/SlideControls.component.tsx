"use client";

import type { KeyboardEventHandler } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { heroSectionStyles as styles } from "../../../styles/hero/heroSection.styles";

function CarouselIconButton({
  label,
  onClick,
  onKeyDown,
  children,
}: {
  label: string;
  onClick: () => void;
  onKeyDown?: KeyboardEventHandler<HTMLElement>;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      variant="secondary"
      size="icon-sm"
      aria-label={label}
      onClick={onClick}
      onKeyDown={onKeyDown}
      className={styles.iconButton}
    >
      {children}
    </Button>
  );
}

export function SlideControls({
  onPrev,
  onNext,
  onKeyDown,
  canTogglePause = false,
  isPaused = false,
  onTogglePause,
}: {
  onPrev: () => void;
  onNext: () => void;
  /** Arrow-key slide navigation — carried by the controls so the carousel
   *  container itself stays non-interactive (no fake tab stop). */
  onKeyDown?: KeyboardEventHandler<HTMLElement>;
  /** Reduced motion never autoplays, so there is nothing to pause. */
  canTogglePause?: boolean;
  isPaused?: boolean;
  onTogglePause?: () => void;
}) {
  const PauseIcon = isPaused ? Play : Pause;
  const pauseButton =
    canTogglePause && onTogglePause ? (
      <CarouselIconButton
        label={isPaused ? LABELS.playSlideshow : LABELS.pauseSlideshow}
        onClick={onTogglePause}
        onKeyDown={onKeyDown}
      >
        <PauseIcon size={18} />
      </CarouselIconButton>
    ) : null;

  return (
    <>
      {/* Desktop: stacked controls on the right */}
      <div className={styles.desktopControls}>
        <div className={styles.desktopGroup}>
          <CarouselIconButton
            label={LABELS.previousSlide}
            onClick={onPrev}
            onKeyDown={onKeyDown}
          >
            <ChevronLeft size={20} />
          </CarouselIconButton>
          <CarouselIconButton
            label={LABELS.nextSlide}
            onClick={onNext}
            onKeyDown={onKeyDown}
          >
            <ChevronRight size={20} />
          </CarouselIconButton>
          {pauseButton}
        </div>
      </div>

      {/* Mobile: bottom corners — clear of centered stack controls on desktop */}
      <div className={styles.mobilePrev}>
        <CarouselIconButton
          label={LABELS.previousSlide}
          onClick={onPrev}
          onKeyDown={onKeyDown}
        >
          <ChevronLeft size={18} />
        </CarouselIconButton>
      </div>
      {pauseButton ? (
        <div className={styles.mobilePause}>{pauseButton}</div>
      ) : null}
      <div className={styles.mobileNext}>
        <CarouselIconButton
          label={LABELS.nextSlide}
          onClick={onNext}
          onKeyDown={onKeyDown}
        >
          <ChevronRight size={18} />
        </CarouselIconButton>
      </div>
    </>
  );
}
