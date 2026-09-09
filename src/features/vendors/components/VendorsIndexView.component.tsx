import Link from "next/link";
import { ArrowRight, Store } from "lucide-react";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { MediaImage } from "@/shared/components/MediaImage.component";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { EmptyState } from "@/shared/components/EmptyState.component";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths";
import { formatLabel } from "@/shared/utils/formatLabel";
import type { StorefrontVendor } from "../api/vendors.api";
import { vendorsIndexViewStyles as styles } from "./vendorsIndexView.styles";

interface VendorsIndexViewProps {
  vendors: StorefrontVendor[];
  isLoading?: boolean;
  isEmpty?: boolean;
}

function vendorInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function VendorsIndexView({
  vendors,
  isLoading,
  isEmpty,
}: VendorsIndexViewProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <TextEyebrow className={styles.eyebrow}>
          {LABELS.vendorsIndexEyebrow}
        </TextEyebrow>
        <h1 className={styles.title}>{LABELS.allVendors}</h1>
        <p className={styles.subtitle}>
          {formatLabel(LABELS.vendorsIndexHint, { site: LABELS.brandName })}
        </p>
      </div>

      {isLoading ? (
        <div className={styles.grid}>
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className={styles.skeletonCard}>
              <div className={styles.skeletonRow}>
                <Skeleton className={styles.skeletonAvatar} />
                <div className={styles.skeletonContent}>
                  <Skeleton className={styles.skeletonTitle} />
                  <Skeleton className={styles.skeletonSubtitle} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : isEmpty ? (
        <EmptyState
          icon={Store}
          heading={LABELS.noVendorsYet}
          message={LABELS.noVendorsYetHint}
          actionLabel={LABELS.browseProducts}
          actionTo={PATHS.products}
        />
      ) : (
        <ul className={styles.gridList}>
          {vendors.map((vendor) => (
            <li key={vendor.id} className={styles.gridItem}>
              <Link
                href={PATHS.vendorPage(vendor.slug)}
                className={styles.tileLink}
              >
                <div className={styles.tileRow}>
                  <span className={styles.logoWrapper}>
                    {vendor.logoUrl ? (
                      <MediaImage
                        src={vendor.logoUrl}
                        alt=""
                        unavailableLabel={LABELS.imageNotAvailable}
                        sizes="48px"
                        imageClassName={styles.logoImageCover}
                        className={styles.logoImage}
                      />
                    ) : (
                      <span className={styles.logoFallbackText}>
                        {vendorInitials(vendor.businessName) || "V"}
                      </span>
                    )}
                  </span>
                  <span className={styles.tileContent}>
                    <span className={styles.vendorName}>
                      {vendor.businessName}
                    </span>
                    {vendor.description ? (
                      <span className={styles.vendorDescription}>
                        {vendor.description}
                      </span>
                    ) : null}
                  </span>
                </div>
                <span className={styles.visitShopRow}>
                  {LABELS.visitShop}
                  <ArrowRight className={styles.arrowIcon} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
