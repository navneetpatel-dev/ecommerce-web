"use client";

import { useCallback } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import type { ProductListItem } from "@/shared/api/types";
import { MediaImage } from "@/shared/components/media/MediaImage.component";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths/paths";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { LOW_STOCK_THRESHOLD } from "../../../constants/card/card";
import { CardControls } from "./CardControls.component";
import { CARD_MEDIA_STYLES } from "../../../styles/card/cardMedia.styles";

interface CardMediaProps {
  product: ProductListItem;
  imageUnavailable: boolean;
  onUnavailableChange: (unavailable: boolean) => void;
  showWishlist: boolean;
  isWishlisted: boolean;
  canQuickAdd: boolean;
  inCart: boolean;
  isAddingToCart: boolean;
  cartQuantity: number;
  maxQuantity: number;
  quickAddLabel: string;
  onPrefetch?: () => void;
  onToggleWishlist?: () => void;
  onAddToCart?: () => void;
  onQuantityChange?: (quantity: number) => void;
}

export function CardMedia({
  product,
  imageUnavailable,
  onUnavailableChange,
  showWishlist,
  isWishlisted,
  canQuickAdd,
  inCart,
  isAddingToCart,
  cartQuantity,
  maxQuantity,
  quickAddLabel,
  onPrefetch,
  onToggleWishlist,
  onAddToCart,
  onQuantityChange,
}: CardMediaProps) {
  const handleWishlistClick = useCallback(() => {
    onToggleWishlist?.();
  }, [onToggleWishlist]);

  const isLowStock = product.stock <= LOW_STOCK_THRESHOLD && product.stock > 0;
  const isOutOfStock = product.stock === 0;

  return (
    <div className={CARD_MEDIA_STYLES.imageWrapper(imageUnavailable)}>
      {/* Only the media links to the product: the wishlist and quick-add
          controls layer above it as siblings, so no button is ever nested
          inside the anchor. */}
      <Link
        href={PATHS.product(product.slug)}
        className={CARD_MEDIA_STYLES.link}
        onMouseEnter={onPrefetch}
      >
        <MediaImage
          src={product.imageUrl}
          alt={product.name}
          unavailableLabel={`${product.name} image not available`}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          loading="lazy"
          imageClassName={CARD_MEDIA_STYLES.image}
          onUnavailableChange={onUnavailableChange}
        />

        {isLowStock && (
          <span className={CARD_MEDIA_STYLES.lowStockBadge}>
            {formatLabel(LABELS.lowStockLeft, { count: product.stock })}
          </span>
        )}

        {isOutOfStock && (
          <div className={CARD_MEDIA_STYLES.outOfStockOverlay}>
            <span className={CARD_MEDIA_STYLES.outOfStockBadge}>
              {LABELS.outOfStock}
            </span>
          </div>
        )}
      </Link>

      {showWishlist && (
        <Button
          type="button"
          variant="secondary"
          size="icon-sm"
          onClick={handleWishlistClick}
          className={CARD_MEDIA_STYLES.wishlistButton(isWishlisted)}
          aria-label={
            isWishlisted ? LABELS.removeFromWishlist : LABELS.addToWishlist
          }
        >
          <Heart
            size={18}
            className={CARD_MEDIA_STYLES.wishlistIcon(isWishlisted)}
          />
        </Button>
      )}

      {canQuickAdd && (
        <div className={CARD_MEDIA_STYLES.quickAddOverlay(inCart)}>
          <CardControls
            variant="overlay"
            inCart={inCart}
            isAddingToCart={isAddingToCart}
            cartQuantity={cartQuantity}
            maxQuantity={maxQuantity}
            quickAddLabel={quickAddLabel}
            onAddToCart={onAddToCart}
            onQuantityChange={onQuantityChange}
          />
        </div>
      )}
    </div>
  );
}
