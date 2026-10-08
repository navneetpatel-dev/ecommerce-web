/**
 * Scroll behaviour that respects the OS "reduce motion" setting. CSS motion is
 * zeroed globally (globals.css) and framer-motion goes through
 * MotionPreferenceProvider, but programmatic `scrollTo`/`scrollIntoView` calls
 * are not covered by either — this is the shared guard for those call sites.
 */
export function motionSafeScrollBehavior(): ScrollBehavior {
  if (typeof window === "undefined" || !window.matchMedia) return "auto";
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";
}
