"use client";

import { AUTOPLAY_MS, DEFAULT_SLIDES } from "../../../constants/hero/constants";
import { LABELS } from "@/shared/constants/labels";
import { SlideControls } from "./SlideControls.component";
import { SlideCopy } from "./SlideCopy.component";
import { SlideImage } from "./SlideImage.component";
import { useHeroCarousel } from "../../../hooks/hero/useHeroCarousel.hook";
import type { HeroSlide } from "../../../types/hero/types";
import { heroSectionStyles as styles } from "../../../styles/hero/heroSection.styles";

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
    canTogglePause,
    isPaused,
    togglePause,
    handleMouseEnter,
    handleMouseLeave,
    handleFocus,
    handleBlur,
  } = useHeroCarousel({ slides, autoplayMs });

  if (!active) return null;

  return (
    /* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions --
       Passive intent listeners only: autoplay pauses while a pointer or
       keyboard focus is inside the carousel (WCAG 2.2.2). No click/keyboard
       action, and no interactive role, is implied. */
    <section
      aria-roledescription="carousel"
      aria-labelledby={labelId}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={styles.section}
    >
      <h2 id={labelId} className={styles.srOnly}>
        {LABELS.featuredCollections}
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

        {count > 1 ? (
          <SlideControls
            onPrev={goPrev}
            onNext={goNext}
            onKeyDown={onKeyDown}
            canTogglePause={canTogglePause}
            isPaused={isPaused}
            onTogglePause={togglePause}
          />
        ) : null}
      </div>
    </section>
  );
}
