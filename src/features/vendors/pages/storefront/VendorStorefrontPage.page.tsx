"use client";

import { Store } from "lucide-react";
import Link from "next/link";
import { useVendorStorefrontPage } from "../../hooks/storefront/useVendorStorefrontPage.hook";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import { EmptyState } from "@/shared/components/display/EmptyState.component";
import { MediaImage } from "@/shared/components/media/MediaImage.component";
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
  const currentUser = useAuthStore((state) => state.currentUser);
  const { vendor, vendorLoading, vendorNotFound, products, productsLoading } =
    useVendorStorefrontPage(slug);

  const isOwnMerchant = Boolean(
    currentUser?.vendorId && vendor?.id && currentUser.vendorId === vendor.id,
  );
  const isKycPending = vendor?.kycComplete === false;

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
      {isOwnMerchant ? (
        <div className="bg-primary/10 border-b border-primary/20 px-4 py-2.5 text-xs sm:text-sm flex flex-wrap items-center justify-between gap-2 text-primary font-medium">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>Store Preview Mode · Logged in as Merchant</span>
          </div>
          <Link
            href={PATHS.vendor.overview}
            className="underline hover:no-underline font-semibold"
          >
            Return to Vendor Dashboard →
          </Link>
        </div>
      ) : null}

      {isKycPending ? (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-xs sm:text-sm text-amber-800 dark:text-amber-300 text-center font-medium">
          Verification in Progress: This store is currently undergoing merchant
          verification. Checkout may be temporarily paused.
        </div>
      ) : null}

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
