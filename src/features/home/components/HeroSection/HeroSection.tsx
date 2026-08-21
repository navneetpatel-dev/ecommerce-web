"use client";

import { AUTOPLAY_MS, DEFAULT_SLIDES } from "./constants";
import { SlideControls } from "./SlideControls";
import { SlideCopy } from "./SlideCopy";
import { SlideImage } from "./SlideImage";
import { useHeroCarousel } from "./useHeroCarousel";
import type { HeroSlide } from "./types";

interface HeroSectionProps {
  slides?: HeroSlide[];
  autoplayMs?: number;
}

export function HeroSection({
  slides = DEFAULT_SLIDES,
  autoplayMs = AUTOPLAY_MS,
}: HeroSectionProps) {
  const {
    labelId,
    reduceMotion,
    index,
    direction,
    active,
    count,
    goNext,
    goPrev,
    onKeyDown,
    onTouchStart,
    onTouchEnd,
  } = useHeroCarousel({ slides, autoplayMs });

  if (!active) return null;

  return (
    <section
      aria-roledescription="carousel"
      aria-labelledby={labelId}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className="relative w-full overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset"
    >
      <h2 id={labelId} className="sr-only">
        Featured collections
      </h2>

      <div className="relative min-h-[min(78vh,640px)] md:min-h-[min(82vh,720px)]">
        <SlideImage
          slide={active}
          index={index}
          direction={direction}
          autoplayMs={autoplayMs}
          reduceMotion={Boolean(reduceMotion)}
        />

        <div className="storefront-container relative z-10 flex h-full min-h-[min(78vh,640px)] flex-col justify-end pb-24 pt-16 md:min-h-[min(82vh,720px)] md:justify-center md:pb-24 md:pt-20">
          <SlideCopy
            slide={active}
            direction={direction}
            reduceMotion={Boolean(reduceMotion)}
          />
        </div>

        {count > 1 ? <SlideControls onPrev={goPrev} onNext={goNext} /> : null}
      </div>
    </section>
  );
}
