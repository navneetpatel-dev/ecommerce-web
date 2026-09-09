"use client";

import { Store } from "lucide-react";
import { useVendorStorefrontPage } from "../../hooks/storefront/useVendorStorefrontPage.hook";
import { EmptyState } from "@/shared/components/EmptyState.component";
import { MediaImage } from "@/shared/components/MediaImage.component";
import { ProductGrid } from "@/features/products";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths/paths";
import { Skeleton } from "@/shared/components/ui/skeleton";
import Image from "next/image";
import { vendorStorefrontPageStyles as styles } from "./vendorStorefrontPage.styles";

interface VendorStorefrontPageProps {
  slug: string;
}

export function VendorStorefrontPage({ slug }: VendorStorefrontPageProps) {
  const { vendor, vendorLoading, vendorNotFound, products, productsLoading } =
    useVendorStorefrontPage(slug);

  if (vendorLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Skeleton className={styles.loadingBanner} />
        <Skeleton className={styles.loadingTitle} />
        <Skeleton className={styles.loadingSubtitle} />
        <div className={styles.loadingGrid}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className={styles.loadingProductCard} />
          ))}
        </div>
      </div>
    );
  }

  if (vendorNotFound || !vendor) {
    return (
      <div className={styles.emptyContainer}>
        <EmptyState
          icon={Store}
          heading={LABELS.shopUnavailableHeading}
          message={LABELS.shopUnavailableBody}
          actionLabel={LABELS.browseOtherShops}
          actionTo={PATHS.vendors}
        />
      </div>
    );
  }

  return (
    <div className={styles.pageRoot}>
      {vendor.bannerUrl ? (
        <div className={styles.bannerContainer}>
          <MediaImage
            src={vendor.bannerUrl}
            alt={vendor.businessName}
            unavailableLabel={LABELS.imageNotAvailable}
            sizes="100vw"
            className={styles.bannerMedia}
            imageClassName={styles.bannerMediaImage}
            priority
          />
        </div>
      ) : (
        <div aria-hidden className={styles.bannerFallbackGlow} />
      )}

      <div className={styles.contentContainer}>
        <header className={styles.header}>
          {vendor.logoUrl ? (
            <div className={styles.logoContainer}>
              <Image
                src={vendor.logoUrl}
                alt={vendor.businessName}
                fill
                className={styles.logoImage}
                sizes="64px"
              />
            </div>
          ) : (
            <div className={styles.logoFallback}>
              <Store
                size={24}
                className={styles.storeIcon}
                strokeWidth={1.25}
              />
            </div>
          )}
          <div>
            <p className={styles.shopEyebrow}>Shop</p>
            <h1 className={styles.vendorHeading}>{vendor.businessName}</h1>
            {vendor.description ? (
              <p className={styles.vendorDescription}>{vendor.description}</p>
            ) : null}
          </div>
        </header>

        <ProductGrid
          products={products}
          loading={productsLoading}
          emptyHeading={LABELS.noVendorProductsHeading}
          emptyMessage={LABELS.noVendorProductsHint}
          emptyActionLabel={LABELS.browseAllProducts}
          emptyActionTo={PATHS.products}
        />
      </div>
    </div>
  );
}
