"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { AUTOPLAY_MS, resolveDirection } from "./constants";
import type { HeroSlide } from "./types";

export function useHeroCarousel({
  slides,
  autoplayMs = AUTOPLAY_MS,
}: {
  slides: HeroSlide[];
  autoplayMs?: number;
}) {
  const labelId = useId();
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const touchStartX = useRef<number | null>(null);
  const indexRef = useRef(0);

  const count = slides.length;
  const active = slides[index] ?? slides[0];
  const paused = Boolean(reduceMotion) || count <= 1;

  const goTo = useCallback(
    (next: number, forcedDirection?: 1 | -1) => {
      if (count === 0) return;
      const from = indexRef.current;
      const normalized = ((next % count) + count) % count;
      if (normalized === from) return;
      setDirection(
        forcedDirection ?? resolveDirection(from, normalized, count),
      );
      indexRef.current = normalized;
      setIndex(normalized);
    },
    [count],
  );

  const goNext = useCallback(() => goTo(indexRef.current + 1, 1), [goTo]);
  const goPrev = useCallback(() => goTo(indexRef.current - 1, -1), [goTo]);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(goNext, autoplayMs);
    return () => window.clearInterval(timer);
  }, [paused, autoplayMs, goNext]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goNext();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      goPrev();
    }
  };

  const onTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const onTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
    const delta = endX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 48) return;
    if (delta < 0) goNext();
    else goPrev();
  };

  return {
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
  };
}
