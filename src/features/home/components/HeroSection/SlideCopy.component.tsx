"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { copyContainer, copyItem } from "./constants";
import type { HeroSlide } from "./types";
import { heroSectionStyles as styles } from "./heroSection.styles";

interface SlideCopyProps {
  slide: HeroSlide;
  direction: number;
  reduceMotion: boolean;
}

export function SlideCopy({ slide, direction, reduceMotion }: SlideCopyProps) {
  return (
    <AnimatePresence mode="wait" initial={false} custom={direction}>
      <motion.div
        key={slide.id + "-copy"}
        custom={direction}
        variants={reduceMotion ? undefined : copyContainer}
        initial={reduceMotion ? { opacity: 0 } : "enter"}
        animate={reduceMotion ? { opacity: 1 } : "center"}
        exit={reduceMotion ? { opacity: 0 } : "exit"}
        className={styles.copyContainer}
        aria-live="polite"
        aria-atomic="true"
      >
        <motion.p
          custom={direction}
          variants={reduceMotion ? undefined : copyItem}
          className={styles.eyebrow}
        >
          {slide.eyebrow}
        </motion.p>
        <motion.h1
          custom={direction}
          variants={reduceMotion ? undefined : copyItem}
          className={styles.headline}
          style={{ fontSize: "var(--text-display-lg)" }}
        >
          {slide.headline}
        </motion.h1>
        <motion.p
          custom={direction}
          variants={reduceMotion ? undefined : copyItem}
          className={styles.subheadline}
        >
          {slide.subheadline}
        </motion.p>
        <motion.div
          custom={direction}
          variants={reduceMotion ? undefined : copyItem}
          className={styles.ctaGroup}
        >
          <Link href={slide.ctaHref} className={styles.primaryCta}>
            {slide.ctaLabel}
            <ArrowRight size={16} strokeWidth={2} aria-hidden />
          </Link>
          {slide.secondaryCtaLabel && slide.secondaryCtaHref ? (
            <Link href={slide.secondaryCtaHref} className={styles.secondaryCta}>
              {slide.secondaryCtaLabel}
            </Link>
          ) : null}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
