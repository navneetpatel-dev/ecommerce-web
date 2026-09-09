"use client";

import { AUTOPLAY_MS, DEFAULT_SLIDES } from "./constants";
import { SlideControls } from "./SlideControls.component";
import { SlideCopy } from "./SlideCopy.component";
import { SlideImage } from "./SlideImage.component";
import { useHeroCarousel } from "./useHeroCarousel.hook";
import type { HeroSlide } from "./types";
import { heroSectionStyles as styles } from "./heroSection.styles";

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
      className={styles.section}
    >
      <h2 id={labelId} className={styles.srOnly}>
        Featured collections
      </h2>

      <div className={styles.slideWrapper}>
        <SlideImage
          slide={active}
          index={index}
          direction={direction}
          autoplayMs={autoplayMs}
          reduceMotion={Boolean(reduceMotion)}
        />

        <div className={styles.contentContainer}>
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
