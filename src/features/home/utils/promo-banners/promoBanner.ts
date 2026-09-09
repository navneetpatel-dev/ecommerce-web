import { PATHS } from "@/shared/constants/paths/paths";
import { PROMO_BANNER_LINK_TYPE } from "@/shared/constants/statuses";
import type { PromoBanner } from "@/shared/api/types";
import type { HeroSlide } from "@/features/home/components/hero/HeroSection.component";
import { LABELS } from "@/shared/constants/labels";

export function resolvePromoBannerHref(banner: PromoBanner): string {
  if (banner.linkType === PROMO_BANNER_LINK_TYPE.URL) {
    return banner.linkUrl || PATHS.products;
  }
  if (!banner.linkSlug) return PATHS.products;
  if (banner.linkType === PROMO_BANNER_LINK_TYPE.PRODUCT) {
    return PATHS.product(banner.linkSlug);
  }
  if (banner.linkType === PROMO_BANNER_LINK_TYPE.CATEGORY) {
    return PATHS.category(banner.linkSlug);
  }
  if (banner.linkType === PROMO_BANNER_LINK_TYPE.VENDOR) {
    return PATHS.vendorPage(banner.linkSlug);
  }
  return PATHS.products;
}

export function promoBannerToHeroSlide(banner: PromoBanner): HeroSlide {
  return {
    id: banner.id,
    eyebrow: LABELS.promoBannerEyebrow,
    headline: banner.title,
    subheadline: "",
    ctaLabel: LABELS.shopNow,
    ctaHref: resolvePromoBannerHref(banner),
    imageSrc: banner.imageUrl,
    imageAlt: banner.title,
  };
}
