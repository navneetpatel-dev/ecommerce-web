"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";

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
      className="rounded-full border-white/40 bg-black/55 text-white shadow-elevation-2 backdrop-blur-md hover:border-white/70 hover:bg-black/70 hover:text-white"
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
      <div className="pointer-events-none absolute inset-y-0 right-0 z-20 hidden items-center pr-4 md:flex lg:pr-8">
        <div className="pointer-events-auto flex flex-col gap-2">
          <CarouselIconButton label={LABELS.previousSlide} onClick={onPrev}>
            <ChevronLeft size={20} />
          </CarouselIconButton>
          <CarouselIconButton label={LABELS.nextSlide} onClick={onNext}>
            <ChevronRight size={20} />
          </CarouselIconButton>
        </div>
      </div>

      {/* Mobile: bottom corners — clear of centered stack controls on desktop */}
      <div className="absolute bottom-5 left-3 z-20 md:hidden">
        <CarouselIconButton label={LABELS.previousSlide} onClick={onPrev}>
          <ChevronLeft size={18} />
        </CarouselIconButton>
      </div>
      <div className="absolute bottom-5 right-3 z-20 md:hidden">
        <CarouselIconButton label={LABELS.nextSlide} onClick={onNext}>
          <ChevronRight size={18} />
        </CarouselIconButton>
      </div>
    </>
  );
}
