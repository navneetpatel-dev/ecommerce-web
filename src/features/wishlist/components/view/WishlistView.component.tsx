"use client";

import { Trash2 } from "lucide-react";
import { EmptyWishlistState } from "./EmptyWishlistState.component";
import { SkeletonGrid } from "@/shared/components/Skeletons.component";
import { ProductCardContainer } from "@/features/products";
import { NotifyMeButton } from "@/features/stockAlerts";
import { PaginationContainer } from "@/shared/containers/navigation/PaginationContainer.container";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { wishlistPriceDropLabels } from "@/shared/constants/labels/wishlistPriceDrop";
import { UNAVAILABLE_REASON } from "@/shared/constants/statuses";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { formatInr } from "@/shared/utils/formatting/orderFormat";
import { priceDropAmount } from "../../utils/price-drop/priceDrop.utils";
import type { WishlistPageItem } from "../../hooks/view/useWishlistPage.hook";
import type { UnavailableReason } from "@/shared/constants/statuses";
import { wishlistViewStyles as styles } from "../../styles/view/wishlistView.styles";

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
      <div className={styles.loadingContainer}>
        <SkeletonGrid count={4} />
      </div>
    );
  }

  if (isEmpty) return <EmptyWishlistState />;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{LABELS.myWishlist}</h1>
      {removeError ? (
        <p role="alert" className={styles.errorText}>
          {removeError}
        </p>
      ) : null}
      <div className={styles.grid}>
        {items.map(({ wishlistItem, product, isAvailable }) => {
          if (!isAvailable) {
            return (
              <div key={wishlistItem.id} className={styles.unavailableCard}>
                <ProductCardContainer product={product} showWishlist={false} />
                <div className={styles.overlay}>
                  <Badge variant="destructive" className={styles.badge}>
                    {unavailableLabel(wishlistItem.unavailableReason)}
                  </Badge>
                  {wishlistItem.unavailableReason ===
                    UNAVAILABLE_REASON.OUT_OF_STOCK &&
                  product.variants?.[0]?.id ? (
                    <div className={styles.notifyWrapper}>
                      <NotifyMeButton variantId={product.variants[0].id} />
                    </div>
                  ) : null}
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="icon-sm"
                  className={styles.removeButton}
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
            <div key={product.id} className={styles.availableCard}>
              <ProductCardContainer
                product={product}
                quickAddLabel={LABELS.moveToCart}
                showWishlist
              />
              {dropAmount != null ? (
                <div className={styles.priceDropBadgeWrapper}>
                  <Badge variant="success" className={styles.badge}>
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
        <div className={styles.paginationWrapper}>
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
