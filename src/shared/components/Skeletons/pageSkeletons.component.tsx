import { Skeleton } from "@/shared/components/ui/skeleton";
import { CategoryGridSkeleton, SkeletonGrid } from "./primitives.component";
import { pageSkeletonsStyles as styles } from "./pageSkeletons.styles";

/** Home / generic storefront content while a soft navigation settles. */
export function StorefrontPageSkeleton() {
  return (
    <div className={styles.storefrontRoot}>
      <Skeleton className={styles.storefrontHero} />
      <div className={styles.storefrontContainer}>
        <div className={styles.headingStack}>
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-7 w-48" />
        </div>
        <CategoryGridSkeleton count={10} />
        <div className={styles.headingStackPadded}>
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-8 w-40" />
        </div>
        <SkeletonGrid count={8} />
      </div>
    </div>
  );
}

export function CartPageSkeleton() {
  return (
    <div className={styles.pageRoot}>
      <div className={styles.cartContainer}>
        <div className={styles.cartTitleStack}>
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-8 w-48" />
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
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-9 w-64" />
        </div>
        <Skeleton className={styles.checkoutProgress} />
        <div className={styles.checkoutGrid}>
          <div className={styles.checkoutMainCol}>
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-8 w-72" />
            <Skeleton className="h-4 w-80" />
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
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-full max-w-md" />
      </div>
      <CategoryGridSkeleton count={10} />
    </div>
  );
}

export function ProfilePageSkeleton() {
  return (
    <div className={styles.profileContainer}>
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-10 w-48" />
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
      <Skeleton className="h-8 w-36" />
      <SkeletonGrid count={8} />
    </div>
  );
}

export function ContentPageSkeleton() {
  return (
    <div className={styles.contentContainer}>
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-10 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className={styles.contentImage} />
    </div>
  );
}
