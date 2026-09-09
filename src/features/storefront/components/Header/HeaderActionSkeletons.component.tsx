import { cn } from "@/shared/utils/dom/cn";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { LABELS } from "@/shared/constants/labels";
import { ACCOUNT_TRIGGER_BOX } from "./headerShared";
import { headerStyles as styles } from "./header.styles";

/**
 * Placeholders for the cart / wishlist / wallet buttons.
 *
 * Their badges are server counts, so rendering the icons with a zero badge
 * first makes the numbers pop in a moment later. Each placeholder repeats its
 * button's responsive visibility so the row keeps its width at every breakpoint.
 */
export function StorefrontActionButtonsSkeleton() {
  return (
    <>
      <Skeleton
        className={cn("hidden lg:block", styles.iconButtonBox)}
        aria-hidden
      />
      <Skeleton className={styles.iconButtonBox} aria-hidden />
      <Skeleton className={styles.iconButtonBox} aria-hidden />
    </>
  );
}

/** Placeholder for the "Orders" link, which only appears once the role is known. */
export function HeaderOrdersLinkSkeleton() {
  return (
    <div className={styles.ordersSkeleton}>
      <Skeleton className={styles.ordersSkeletonBox} aria-hidden />
    </div>
  );
}

/**
 * Placeholder for the account menu trigger.
 *
 * Built from ACCOUNT_TRIGGER_BOX — the same geometry the real button uses — so
 * the avatar swaps in without moving anything beside it. The reserved chevron
 * slot matters: the trigger is a pill at sm+, not a bare circle.
 */
export function AccountMenuSkeleton() {
  return (
    <div className={cn(ACCOUNT_TRIGGER_BOX, styles.accountSkeletonPill)}>
      <Skeleton className={styles.avatarSkeleton} aria-hidden />
      <span className={styles.chevronSlot} aria-hidden />
    </div>
  );
}

/**
 * A skeleton sized by the text it replaces.
 *
 * The real label is rendered invisibly to reserve its exact width, so the nav
 * cannot jump when the links appear. Hardcoded widths would only be right at
 * one font size.
 */
function TextSkeleton({
  children,
  className,
  radius = "rounded-md",
}: {
  children: React.ReactNode;
  className?: string;
  radius?: string;
}) {
  return (
    <span className={styles.textSkeletonWrapper}>
      <span className={cn("invisible", className)}>{children}</span>
      <Skeleton className={cn("absolute inset-0", radius)} aria-hidden />
    </span>
  );
}

/**
 * Placeholder for the desktop nav and search bar.
 *
 * Shown until the session resolves, because the viewer's role decides whether
 * storefront chrome belongs here at all — a vendor loses this whole row.
 */
export function DesktopPrimaryNavSkeleton({
  primaryLinks,
}: {
  primaryLinks: readonly { href: string; label: string }[];
}) {
  return (
    <>
      <nav
        aria-hidden
        className={styles.primaryNavSkeleton}
        data-testid="primary-nav-skeleton"
      >
        <TextSkeleton className={styles.navCategoriesText}>
          {LABELS.categories}
          <span className={styles.navCategoriesIconSlot} />
        </TextSkeleton>
        {primaryLinks.map((link) => (
          <TextSkeleton key={link.href} className={styles.navLinkText}>
            {link.label}
          </TextSkeleton>
        ))}
      </nav>

      <div className={styles.searchSkeletonWrapper}>
        <Skeleton className={styles.searchSkeletonInput} aria-hidden />
      </div>
    </>
  );
}

/**
 * Placeholder for the hamburger, which only exists for storefront viewers —
 * a workspace role gets a different button, or none.
 */
export function HeaderMenuButtonSkeleton() {
  return <Skeleton className={styles.menuButtonSkeleton} aria-hidden />;
}

/** Placeholder for the lg-to-xl search trigger, which the tab bar replaces below lg. */
export function HeaderSearchButtonSkeleton() {
  return (
    <Skeleton
      className={cn(styles.searchButtonSkeleton, styles.iconButtonBox)}
      aria-hidden
    />
  );
}
