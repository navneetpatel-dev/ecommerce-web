"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { heroSectionStyles as styles } from "./heroSection.styles";

function CarouselIconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      variant="secondary"
      size="icon-sm"
      aria-label={label}
      onClick={onClick}
      className={styles.iconButton}
    >
      {children}
    </Button>
  );
}

export function SlideControls({
  onPrev,
  onNext,
}: {
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <>
      {/* Desktop: stacked controls on the right */}
      <div className={styles.desktopControls}>
        <div className={styles.desktopGroup}>
          <CarouselIconButton label={LABELS.previousSlide} onClick={onPrev}>
            <ChevronLeft size={20} />
          </CarouselIconButton>
          <CarouselIconButton label={LABELS.nextSlide} onClick={onNext}>
            <ChevronRight size={20} />
          </CarouselIconButton>
        </div>
      </div>

      {/* Mobile: bottom corners — clear of centered stack controls on desktop */}
      <div className={styles.mobilePrev}>
        <CarouselIconButton label={LABELS.previousSlide} onClick={onPrev}>
          <ChevronLeft size={18} />
        </CarouselIconButton>
      </div>
      <div className={styles.mobileNext}>
        <CarouselIconButton label={LABELS.nextSlide} onClick={onNext}>
          <ChevronRight size={18} />
        </CarouselIconButton>
      </div>
    </>
  );
}
