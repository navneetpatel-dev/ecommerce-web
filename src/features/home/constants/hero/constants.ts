import { PATHS } from "@/shared/constants/paths/paths";
import type { HeroSlide } from "../../types/hero/types";

export const AUTOPLAY_MS = 4500;
export const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Built-in fallback for when the banners API returns nothing: a single,
 * static, text-only slide on the branded gradient. Deliberately no remote
 * stock photography — placeholder art on a live storefront misrepresents the
 * catalog, and the hero should not depend on a third-party image host.
 */
export const DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: "marketplace",
    eyebrow: "Welcome",
    headline: "Shop independent sellers",
    subheadline:
      "One checkout across every seller — browse the catalog, or start with this week's new arrivals.",
    ctaLabel: "Shop now",
    ctaHref: PATHS.products,
    secondaryCtaLabel: "New arrivals",
    secondaryCtaHref: PATHS.productsNewest,
  },
];

export function resolveDirection(from: number, to: number, count: number) {
  if (from === count - 1 && to === 0) return 1;
  if (from === 0 && to === count - 1) return -1;
  return to > from ? 1 : -1;
}

export const imageVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "72%" : "-72%",
    opacity: 0.35,
    scale: 1.12,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? "-28%" : "28%",
    opacity: 0,
    scale: 1.04,
  }),
};

export const copyContainer = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 56 : -56,
  }),
  center: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.65,
      ease: EASE,
      staggerChildren: 0.08,
      delayChildren: 0.12,
    },
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -36 : 36,
    transition: { duration: 0.35, ease: EASE },
  }),
};

export const copyItem = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 28 : -28,
    y: 10,
  }),
  center: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: 0.55, ease: EASE },
  },
};
