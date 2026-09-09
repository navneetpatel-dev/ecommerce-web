import { PATHS } from "@/shared/constants/paths/paths";
import type { HeroSlide } from "../../types/hero/types";

export const AUTOPLAY_MS = 4500;
export const EASE = [0.22, 1, 0.36, 1] as const;

export const DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: "makers",
    eyebrow: "Marketplace",
    headline: "Discover independent sellers",
    subheadline:
      "Handcrafted goods, artisan food, and unique finds from India's best small businesses.",
    ctaLabel: "Shop Now",
    ctaHref: PATHS.products,
    secondaryCtaLabel: "New arrivals",
    secondaryCtaHref: PATHS.productsNewest,
    imageSrc:
      "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=2400&q=80",
    imageMobileSrc:
      "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Artisan hands shaping clay on a pottery wheel",
  },
  {
    id: "textiles",
    eyebrow: "Crafted textiles",
    headline: "Woven with intention",
    subheadline:
      "From handloom cotton to block-printed linen — pieces made slowly, meant to last.",
    ctaLabel: "Shop Now",
    ctaHref: `${PATHS.products}?search=textile`,
    secondaryCtaLabel: "New arrivals",
    secondaryCtaHref: PATHS.productsNewest,
    imageSrc:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=2400&q=80",
    imageMobileSrc:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Folded handwoven textiles in warm natural tones",
  },
  {
    id: "kitchen",
    eyebrow: "Pantry & table",
    headline: "Taste the small-batch story",
    subheadline:
      "Spice blends, preserves, and tableware from kitchens and studios across the country.",
    ctaLabel: "Shop Now",
    ctaHref: `${PATHS.products}?search=food`,
    secondaryCtaLabel: "New arrivals",
    secondaryCtaHref: PATHS.productsNewest,
    imageSrc:
      "https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&w=2400&q=80",
    imageMobileSrc:
      "https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Artisan spices and ingredients arranged on a wooden table",
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
