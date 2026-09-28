import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  CategoryGridSkeleton,
  SkeletonCard,
  SkeletonGrid,
} from "./primitives.component";
import { pageSkeletonsStyles as styles } from "../../styles/skeletons/pageSkeletons.styles";

/** Home / generic storefront content while a soft navigation settles. */
export function StorefrontPageSkeleton() {
  return (
    <div className={styles.storefrontRoot}>
      <Skeleton className={styles.storefrontHero} />
      <div className={styles.storefrontContainer}>
        <div className={styles.headingStack}>
          <Skeleton className={styles.h3w16} />
          <Skeleton className={styles.h7w48} />
        </div>
        <CategoryGridSkeleton count={10} />
        <div className={styles.headingStackPadded}>
          <Skeleton className={styles.h3w28} />
          <Skeleton className={styles.h8w40} />
        </div>
        <SkeletonGrid count={8} />
      </div>
    </div>
  );
}

/** Wallet / returns / reviews / gift-cards ledger while the query settles. */
export function LedgerPageSkeleton() {
  return (
    <div className={styles.ledgerContainer}>
      <div className={styles.ledgerHeaderStack}>
        <Skeleton className={styles.h3w28} />
        <Skeleton className={styles.h8w48} />
      </div>
      <Skeleton className={styles.ledgerAside} />
      <SkeletonCard count={3} height={styles.ledgerRow} />
    </div>
  );
}

/** Single-column form pages (order tracking, support create forms). */
export function FormPageSkeleton() {
  return (
    <div className={styles.formContainer}>
      <div className={styles.ledgerHeaderStack}>
        <Skeleton className={styles.h3w24} />
        <Skeleton className={styles.h8w40} />
      </div>
      <SkeletonCard count={3} height={styles.formControl} />
      <div className={styles.formActionRow}>
        <Skeleton className={styles.formControl} />
        <Skeleton className={styles.formControl} />
      </div>
    </div>
  );
}

/** Detail views (return detail, ticket/bug detail, order confirmation). */
export function DetailPageSkeleton() {
  return (
    <div className={styles.detailContainer}>
      <Skeleton className={styles.h3w28} />
      <Skeleton className={styles.detailHero} />
      <SkeletonCard count={3} height={styles.detailCard} />
    </div>
  );
}

/** Delivery agent app shell — list-shaped, matches the task-card UI. */
export function DeliveryPageSkeleton() {
  return (
    <div className={styles.deliveryContainer} aria-busy="true">
      <Skeleton className={styles.deliveryHeaderCard} />
      <div className={styles.deliveryMetricGrid}>
        <Skeleton className={styles.deliveryMetric} />
        <Skeleton className={styles.deliveryMetric} />
        <Skeleton className={styles.deliveryMetric} />
      </div>
      <SkeletonCard count={4} height={styles.deliveryTaskCard} />
    </div>
  );
}

export function CartPageSkeleton() {
  return (
    <div className={styles.pageRoot}>
      <div className={styles.cartContainer}>
        <div className={styles.cartTitleStack}>
          <Skeleton className={styles.h3w24} />
          <Skeleton className={styles.h8w48} />
        </div>
        <div className={styles.cartGrid}>
          <div className={styles.cartMainCol}>
            <Skeleton className={styles.cartLineItem} />
            <Skeleton className={styles.cartLineItem} />
            <Skeleton className={styles.cartLineItem} />
          </div>
          <div className={styles.cartAsideCol}>
            <Skeleton className={styles.cartSummary} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function CheckoutPageSkeleton() {
  return (
    <div className={styles.pageRoot}>
      <div className={styles.checkoutContainer}>
        <div className={styles.checkoutTitleStack}>
          <Skeleton className={styles.h3w20} />
          <Skeleton className={styles.h9w64} />
        </div>
        <Skeleton className={styles.checkoutProgress} />
        <div className={styles.checkoutGrid}>
          <div className={styles.checkoutMainCol}>
            <Skeleton className={styles.h3w28} />
            <Skeleton className={styles.h8w72} />
            <Skeleton className={styles.h4w80} />
            <Skeleton className={styles.checkoutCardLg} />
            <Skeleton className={styles.checkoutCardSm} />
          </div>
          <div className={styles.checkoutAsideCol}>
            <Skeleton className={styles.checkoutSummary} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function CategoriesPageSkeleton() {
  return (
    <div className={styles.categoriesContainer}>
      <div className={styles.categoriesHeader}>
        <Skeleton className={styles.h3w16} />
        <Skeleton className={styles.h10w64} />
        <Skeleton className={styles.h4wFullMaxMd} />
      </div>
      <CategoryGridSkeleton count={10} />
    </div>
  );
}

export function ProfilePageSkeleton() {
  return (
    <div className={styles.profileContainer}>
      <Skeleton className={styles.h4w24} />
      <Skeleton className={styles.h10w48} />
      <div className={styles.profileGrid}>
        <Skeleton className={styles.profileAside} />
        <Skeleton className={styles.profileMain} />
      </div>
    </div>
  );
}

export function WishlistPageSkeleton() {
  return (
    <div className={styles.wishlistContainer}>
      <Skeleton className={styles.h8w36} />
      <SkeletonGrid count={8} />
    </div>
  );
}

export function ContentPageSkeleton() {
  return (
    <div className={styles.contentContainer}>
      <Skeleton className={styles.h3w20} />
      <Skeleton className={styles.h10w2_3} />
      <Skeleton className={styles.h4wFull} />
      <Skeleton className={styles.h4wFull} />
      <Skeleton className={styles.h4w4_5} />
      <Skeleton className={styles.contentImage} />
    </div>
  );
}
