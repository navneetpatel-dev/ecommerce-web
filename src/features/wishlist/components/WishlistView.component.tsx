"use client";

import { Trash2 } from "lucide-react";
import { EmptyWishlistState } from "./EmptyWishlistState.component";
import { SkeletonGrid } from "@/shared/components/Skeletons.component";
import { ProductCardContainer } from "@/features/products";
import { NotifyMeButton } from "@/features/stockAlerts";
import { PaginationContainer } from "@/shared/containers/PaginationContainer.container";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { wishlistPriceDropLabels } from "@/shared/constants/labels/wishlistPriceDrop";
import { UNAVAILABLE_REASON } from "@/shared/constants/statuses";
import { cn } from "@/shared/utils/cn";
import { formatLabel } from "@/shared/utils/formatLabel";
import { formatInr } from "@/shared/utils/orderFormat";
import { priceDropAmount } from "../utils/priceDrop.utils";
import type { WishlistPageItem } from "../hooks/useWishlistPage.hook";
import type { UnavailableReason } from "@/shared/constants/statuses";

function unavailableLabel(
  reason: UnavailableReason | null | undefined,
): string {
  switch (reason) {
    case UNAVAILABLE_REASON.OUT_OF_STOCK:
      return LABELS.unavailableReasonOutOfStock;
    case UNAVAILABLE_REASON.PRODUCT_UNPUBLISHED:
      return LABELS.unavailableReasonProductUnpublished;
    case UNAVAILABLE_REASON.VENDOR_UNAVAILABLE:
      return LABELS.unavailableReasonVendorUnavailable;
    default:
      return LABELS.unavailableGeneric;
  }
}

interface WishlistPagination {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

interface WishlistViewProps {
  isLoading: boolean;
  isEmpty: boolean;
  items: WishlistPageItem[];
  pagination: WishlistPagination;
  removeError?: string | null;
  onRemoveItem: (productId: string) => void;
}

export function WishlistView(props: WishlistViewProps) {
  const { isLoading, isEmpty, items, pagination, removeError, onRemoveItem } =
    props;
  if (isLoading) {
    return (
      <div className="storefront-container py-8">
        <SkeletonGrid count={4} />
      </div>
    );
  }

  if (isEmpty) return <EmptyWishlistState />;

  return (
    <div className="storefront-container py-8">
      <h1 className="text-[1.75rem] font-semibold text-ink mb-6">
        {LABELS.myWishlist}
      </h1>
      {removeError ? (
        <p role="alert" className="mb-4 text-[0.875rem] text-danger">
          {removeError}
        </p>
      ) : null}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
        {items.map(({ wishlistItem, product, isAvailable }) => {
          if (!isAvailable) {
            return (
              <div
                key={wishlistItem.id}
                className={cn(
                  "relative rounded-sm border border-line bg-surface",
                  "opacity-60 grayscale",
                )}
              >
                <ProductCardContainer product={product} showWishlist={false} />
                <div className="absolute inset-0 flex flex-col items-start justify-start gap-2 p-3 bg-transparent pointer-events-none">
                  <Badge
                    variant="destructive"
                    className="text-[0.6875rem] pointer-events-none"
                  >
                    {unavailableLabel(wishlistItem.unavailableReason)}
                  </Badge>
                  {wishlistItem.unavailableReason ===
                    UNAVAILABLE_REASON.OUT_OF_STOCK &&
                  product.variants?.[0]?.id ? (
                    <div className="pointer-events-auto">
                      <NotifyMeButton variantId={product.variants[0].id} />
                    </div>
                  ) : null}
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="icon-sm"
                  className="absolute right-2 top-2 z-10 h-8 w-8 min-h-8 max-h-8 rounded-full text-ink-muted hover:bg-danger-subtle hover:text-danger"
                  aria-label={formatLabel(LABELS.removeNamedFromWishlist, {
                    name: product.name,
                  })}
                  onClick={() => onRemoveItem(wishlistItem.productId)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            );
          }

          const dropAmount = priceDropAmount(
            wishlistItem.priceAtAdd,
            product.basePrice,
          );

          return (
            <div key={product.id} className="relative">
              <ProductCardContainer
                product={product}
                quickAddLabel={LABELS.moveToCart}
                showWishlist
              />
              {dropAmount != null ? (
                <div className="absolute left-2 top-2 z-10 pointer-events-none">
                  <Badge
                    variant="success"
                    className="text-[0.6875rem] pointer-events-none"
                  >
                    {wishlistPriceDropLabels.wishlistPriceDropped} ·{" "}
                    {formatLabel(
                      wishlistPriceDropLabels.wishlistPriceDropSaved,
                      {
                        amount: formatInr(dropAmount),
                      },
                    )}
                  </Badge>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
      {pagination.totalPages > 1 && (
        <div className="mt-8">
          <PaginationContainer
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={pagination.onPageChange}
          />
        </div>
      )}
    </div>
  );
}
