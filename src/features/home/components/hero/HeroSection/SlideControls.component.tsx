"use client";

import type { KeyboardEventHandler } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
}: {
  onPrev: () => void;
  onNext: () => void;
  /** Arrow-key slide navigation — carried by the controls so the carousel
   *  container itself stays non-interactive (no fake tab stop). */
  onKeyDown?: KeyboardEventHandler<HTMLElement>;
}) {
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
