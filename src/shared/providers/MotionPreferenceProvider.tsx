"use client";

import { MotionConfig } from "motion/react";

/**
 * Makes every `motion.*` animation respect the OS "reduce motion" setting.
 * framer-motion only honours it per component via `useReducedMotion`, and only
 * the hero carousel and the gallery stage do that by hand — this covers the
 * other ~22 files that animate transforms and layout (Rule 20).
 */
export function MotionPreferenceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
