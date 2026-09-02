import { cn } from "@/shared/utils/cn";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { LABELS } from "@/shared/constants/labels";
import { ACCOUNT_TRIGGER_BOX } from "./headerShared";

/** Matches the icon button box so swapping in the real icon shifts nothing. */
const ICON_BUTTON_BOX = "h-11 w-11 shrink-0 rounded-md max-sm:h-9 max-sm:w-9";

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
        className={cn("hidden lg:block", ICON_BUTTON_BOX)}
        aria-hidden
      />
      <Skeleton className={ICON_BUTTON_BOX} aria-hidden />
      <Skeleton className={ICON_BUTTON_BOX} aria-hidden />
    </>
  );
}

/** Placeholder for the "Orders" link, which only appears once the role is known. */
export function HeaderOrdersLinkSkeleton() {
  return (
    <div className="hidden xl:flex items-center gap-1">
      <Skeleton className="h-8 w-[4.25rem] rounded-md" aria-hidden />
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
    <div className={cn(ACCOUNT_TRIGGER_BOX, "border-line bg-surface")}>
      <Skeleton className="size-7 rounded-full sm:size-8" aria-hidden />
      <span className="hidden size-3 shrink-0 sm:block" aria-hidden />
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
    <span className="relative inline-flex">
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
        className="hidden xl:flex items-center gap-1"
        data-testid="primary-nav-skeleton"
      >
        <TextSkeleton className="inline-flex h-11 items-center gap-1 px-4 text-[0.875rem] sm:px-5 sm:text-body">
          {LABELS.categories}
          <span className="size-4" />
        </TextSkeleton>
        {primaryLinks.map((link) => (
          <TextSkeleton
            key={link.href}
            className="inline-block px-3 py-2 text-body-sm font-medium"
          >
            {link.label}
          </TextSkeleton>
        ))}
      </nav>

      <div className="mx-auto hidden max-w-xl flex-1 xl:flex">
        <Skeleton className="h-11 w-full rounded-full" aria-hidden />
      </div>
    </>
  );
}

/**
 * Placeholder for the hamburger, which only exists for storefront viewers —
 * a workspace role gets a different button, or none.
 */
export function HeaderMenuButtonSkeleton() {
  return (
    <Skeleton
      className="-ml-2 h-11 w-11 shrink-0 rounded-md xl:hidden max-sm:h-9 max-sm:w-9"
      aria-hidden
    />
  );
}

/** Placeholder for the lg-to-xl search trigger, which the tab bar replaces below lg. */
export function HeaderSearchButtonSkeleton() {
  return (
    <Skeleton
      className={cn("hidden lg:block xl:hidden", ICON_BUTTON_BOX)}
      aria-hidden
    />
  );
}
