import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RatingStars } from "@/shared/components/RatingStars.component";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { MediaImage } from "@/shared/components/MediaImage.component";
import { PATHS } from "@/shared/constants/paths";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatLabel";
import type { SpotlightVendor } from "../hooks/useVendorSpotlight.hook";
import { vendorSpotlightSectionStyles as styles } from "./vendorSpotlightSection.styles";

interface VendorSpotlightSectionProps {
  vendors: SpotlightVendor[];
  isLoading?: boolean;
}

function vendorInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function vendorHref(vendor: SpotlightVendor) {
  return vendor.slug
    ? PATHS.vendorPage(vendor.slug)
    : `${PATHS.products}?vendorId=${vendor.id}`;
}

export function VendorSpotlightSection({
  vendors,
  isLoading,
}: VendorSpotlightSectionProps) {
  if (isLoading) {
    return (
      <section>
        <div className={styles.loadingHeader}>
          <TextEyebrow brand>{LABELS.homeCuratedMakers}</TextEyebrow>
          <h2 className={styles.heading}>{LABELS.homeVendorSpotlight}</h2>
        </div>
        <div className={styles.grid}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={styles.skeletonCard}>
              <Skeleton className={styles.skeletonMedia} />
              <div className={styles.skeletonBody}>
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!vendors.length) return null;

  return (
    <section>
      <div className={styles.headerRow}>
        <div>
          <TextEyebrow brand className={styles.eyebrow}>
            {LABELS.homeCuratedMakers}
          </TextEyebrow>
          <h2 className={styles.heading}>{LABELS.homeVendorSpotlight}</h2>
        </div>
        <Link href={PATHS.products} className={styles.browseAllLink}>
          {LABELS.homeBrowseAll} <ArrowRight size={14} />
        </Link>
      </div>

      <div className={styles.grid}>
        {vendors.map((vendor) => (
          <Link
            key={vendor.id}
            href={vendorHref(vendor)}
            className={styles.card}
          >
            <div className={styles.mediaWrapper}>
              {vendor.logoUrl || vendor.coverImageUrl ? (
                <MediaImage
                  src={(vendor.logoUrl || vendor.coverImageUrl)!}
                  alt={
                    vendor.logoUrl
                      ? `${vendor.businessName} logo`
                      : `${vendor.highlightProduct} from ${vendor.businessName}`
                  }
                  unavailableLabel={`${vendor.businessName} image not available`}
                  imageClassName={styles.imageCover}
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  className={styles.mediaImage}
                />
              ) : (
                <div className={styles.fallbackWrapper}>
                  <span className={styles.fallbackInitials}>
                    {vendorInitials(vendor.businessName) || "V"}
                  </span>
                </div>
              )}
            </div>

            <div className={styles.cardBody}>
              <div>
                <h3 className={styles.vendorName}>{vendor.businessName}</h3>
                <p className={styles.vendorKnownFor}>
                  {formatLabel(LABELS.homeKnownFor, {
                    product: vendor.highlightProduct,
                  })}
                </p>
              </div>

              <RatingStars value={vendor.avgRating || 4} size="sm" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
