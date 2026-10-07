"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { AUTOPLAY_MS, resolveDirection } from "../../constants/hero/constants";
import type { HeroSlide } from "../../types/hero/types";

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
  const [userPaused, setUserPaused] = useState(false);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [focusPaused, setFocusPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const indexRef = useRef(0);

  const count = slides.length;
  const active = slides[index] ?? slides[0];
  // WCAG 2.2.2: autoplay yields to reduced motion, an explicit pause, and any
  // hover/focus inside the carousel — a slide never moves under the pointer or
  // while a control has keyboard focus.
  const paused =
    Boolean(reduceMotion) ||
    count <= 1 ||
    userPaused ||
    hoverPaused ||
    focusPaused;
  const canTogglePause = !reduceMotion && count > 1;

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

  const togglePause = useCallback(() => setUserPaused((value) => !value), []);
  const handleMouseEnter = useCallback(() => setHoverPaused(true), []);
  const handleMouseLeave = useCallback(() => setHoverPaused(false), []);
  const handleFocus = useCallback(() => setFocusPaused(true), []);
  const handleBlur = useCallback((event: React.FocusEvent<HTMLElement>) => {
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
      return;
    }
    setFocusPaused(false);
  }, []);

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
    canTogglePause,
    isPaused: userPaused,
    togglePause,
    handleMouseEnter,
    handleMouseLeave,
    handleFocus,
    handleBlur,
  };
}
