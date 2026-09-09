"use client";

import { AnimatePresence, motion } from "motion/react";
import { MediaImage } from "@/shared/components/MediaImage.component";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatLabel";
import { useMediaQuery } from "@/shared/hooks/use-media-query.hook";
import { EASE, imageVariants } from "./constants";
import type { HeroSlide } from "./types";
import { heroSectionStyles as styles } from "./heroSection.styles";

interface SlideImageProps {
  slide: HeroSlide;
  index: number;
  direction: number;
  autoplayMs: number;
  reduceMotion: boolean;
}

const DESKTOP_MEDIA_QUERY = "(min-width: 768px)";

export function SlideImage(props: SlideImageProps) {
  const { slide, index, direction, autoplayMs, reduceMotion } = props;
  const isDesktop = useMediaQuery(DESKTOP_MEDIA_QUERY);

  // Art-directed variants: only the active breakpoint's image mounts so the
  // hidden variant is never downloaded (§7 — do not fetch offscreen media).
  const activeSrc = isDesktop
    ? slide.imageSrc
    : (slide.imageMobileSrc ?? slide.imageSrc);
  const unavailableCopy = formatLabel(LABELS.heroSlideImageUnavailable, {
    headline: slide.headline,
  });

  return (
    <AnimatePresence initial={false} custom={direction} mode="sync">
      <motion.div
        key={slide.id}
        custom={direction}
        variants={reduceMotion ? undefined : imageVariants}
        initial={reduceMotion ? { opacity: 0 } : "enter"}
        animate={reduceMotion ? { opacity: 1 } : "center"}
        exit={reduceMotion ? { opacity: 0 } : "exit"}
        transition={{ duration: reduceMotion ? 0.25 : 0.9, ease: EASE }}
        className={styles.motionContainer}
      >
        <div className={styles.innerOverflow}>
          <motion.div
            className={styles.motionImage}
            initial={reduceMotion ? false : { scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{
              duration: reduceMotion ? 0 : autoplayMs / 1000,
              ease: "linear",
            }}
          >
            <MediaImage
              src={activeSrc}
              alt={slide.imageAlt}
              unavailableLabel={unavailableCopy}
              priority={index === 0}
              imageClassName={styles.mediaCover}
              sizes="100vw"
              className={styles.mediaInset}
            />
          </motion.div>
        </div>

        <div className={styles.gradientHorizontal} aria-hidden />
        <div className={styles.gradientVertical} aria-hidden />
      </motion.div>
    </AnimatePresence>
  );
}
