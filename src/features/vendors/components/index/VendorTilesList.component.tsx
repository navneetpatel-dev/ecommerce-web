import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MediaImage } from "@/shared/components/media/MediaImage.component";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths/paths";
import type { StorefrontVendor } from "../../api/directory/vendors.api";
import { vendorsIndexViewStyles as styles } from "../../styles/index/vendorsIndexView.styles";

function vendorInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/** The shop tiles on the All shops page. */
export function VendorTilesList({ vendors }: { vendors: StorefrontVendor[] }) {
  return (
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
                <span className={styles.vendorName}>{vendor.businessName}</span>
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
  );
}
