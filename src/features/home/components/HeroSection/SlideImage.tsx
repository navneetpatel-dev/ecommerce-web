"use client";

import { AnimatePresence, motion } from "motion/react";
import { MediaImage } from "@/shared/components/MediaImage";
import { EASE, imageVariants } from "./constants";
import type { HeroSlide } from "./types";

interface SlideImageProps {
  slide: HeroSlide;
  index: number;
  direction: number;
  autoplayMs: number;
  reduceMotion: boolean;
}

export function SlideImage({
  slide,
  index,
  direction,
  autoplayMs,
  reduceMotion,
}: SlideImageProps) {
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
        className="absolute inset-0 will-change-transform"
      >
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute inset-0"
            initial={reduceMotion ? false : { scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{
              duration: reduceMotion ? 0 : autoplayMs / 1000,
              ease: "linear",
            }}
          >
            <div className="absolute inset-0 hidden md:block">
              <MediaImage
                src={slide.imageSrc}
                alt={slide.imageAlt}
                unavailableLabel={`${slide.headline} image not available`}
                priority={index === 0}
                imageClassName="object-cover"
                sizes="100vw"
                className="absolute inset-0"
              />
            </div>
            <div className="absolute inset-0 block md:hidden">
              <MediaImage
                src={slide.imageMobileSrc || slide.imageSrc}
                alt={slide.imageAlt}
                unavailableLabel={`${slide.headline} image not available`}
                priority={index === 0}
                imageClassName="object-cover"
                sizes="100vw"
                className="absolute inset-0"
              />
            </div>
          </motion.div>
        </div>

        <div
          className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/25"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/20"
          aria-hidden
        />
      </motion.div>
    </AnimatePresence>
  );
}
