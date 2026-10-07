export interface HeroSlide {
  id: string;
  eyebrow: string;
  headline: string;
  subheadline: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  /** Omit for a text-only branded slide (the built-in fallback). */
  imageSrc?: string;
  imageMobileSrc?: string;
  imageAlt?: string;
}
