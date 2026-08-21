"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { copyContainer, copyItem } from "./constants";
import type { HeroSlide } from "./types";

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
        className="max-w-xl"
        aria-live="polite"
        aria-atomic="true"
      >
        <motion.p
          custom={direction}
          variants={reduceMotion ? undefined : copyItem}
          className="text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-white/70"
        >
          {slide.eyebrow}
        </motion.p>
        <motion.h1
          custom={direction}
          variants={reduceMotion ? undefined : copyItem}
          className="mt-3 font-display leading-[1.05] text-white"
          style={{ fontSize: "var(--text-display-lg)" }}
        >
          {slide.headline}
        </motion.h1>
        <motion.p
          custom={direction}
          variants={reduceMotion ? undefined : copyItem}
          className="mt-4 max-w-md text-[1.0625rem] text-white/80"
        >
          {slide.subheadline}
        </motion.p>
        <motion.div
          custom={direction}
          variants={reduceMotion ? undefined : copyItem}
          className="mt-8 flex flex-wrap items-center gap-3"
        >
          <Link
            href={slide.ctaHref}
            className={cn(
              "inline-flex h-12 items-center gap-2 rounded-full bg-white px-7",
              "text-[0.9375rem] font-medium tracking-tight text-neutral-950",
              "transition-[transform,background-color] duration-200",
              "hover:bg-white/92 active:scale-[0.98]",
            )}
          >
            {slide.ctaLabel}
            <ArrowRight size={16} strokeWidth={2} aria-hidden />
          </Link>
          {slide.secondaryCtaLabel && slide.secondaryCtaHref ? (
            <Link
              href={slide.secondaryCtaHref}
              className={cn(
                "inline-flex h-12 items-center rounded-full border border-white/35 px-7",
                "text-[0.9375rem] font-medium tracking-tight text-white",
                "bg-white/5 backdrop-blur-sm",
                "transition-[transform,background-color,border-color] duration-200",
                "hover:border-white/55 hover:bg-white/12 active:scale-[0.98]",
              )}
            >
              {slide.secondaryCtaLabel}
            </Link>
          ) : null}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
