"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import type { ProductListItem } from "@/shared/api/types";
import { MediaImage } from "@/shared/components/MediaImage.component";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/utils/cn";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths";
import { CardControls } from "./CardControls.component";

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
  return (
    <Link
      href={PATHS.product(product.slug)}
      className="block"
      onMouseEnter={onPrefetch}
    >
      <div
        className={cn(
          "aspect-square rounded-md overflow-hidden bg-paper border border-line relative",
          "transition-colors duration-200",
          imageUnavailable && "group-hover:border-brand",
        )}
      >
        <MediaImage
          src={product.imageUrl}
          alt={product.name}
          unavailableLabel={`${product.name} image not available`}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          loading="lazy"
          imageClassName="object-cover group-hover:scale-105 transition-transform duration-300"
          onUnavailableChange={onUnavailableChange}
        />

        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute top-2 left-2 bg-accent-subtle text-accent text-body-sm font-semibold rounded-sm px-2 py-1">
            Only {product.stock} left
          </span>
        )}

        {product.stock === 0 && (
          <div className="absolute inset-0 bg-overlay flex items-center justify-center">
            <span className="bg-surface text-ink text-body-sm font-medium rounded-sm px-3 py-1.5">
              {LABELS.outOfStock}
            </span>
          </div>
        )}

        {showWishlist && (
          <Button
            type="button"
            variant="secondary"
            size="icon-sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleWishlist?.();
            }}
            className={cn(
              "absolute top-2 right-2 h-8 w-8 min-h-8 max-h-8 rounded-full bg-surface/80 backdrop-blur-xs hover:bg-surface",
              isWishlisted ? "text-danger" : "text-ink-muted",
            )}
            aria-label={
              isWishlisted ? LABELS.removeFromWishlist : LABELS.addToWishlist
            }
          >
            <Heart
              size={18}
              className={cn(
                isWishlisted && "fill-current",
                isWishlisted && "animate-pulse-scale",
              )}
            />
          </Button>
        )}

        {canQuickAdd && (
          <div
            className={cn(
              "absolute bottom-0 left-0 right-0 hidden p-3 md:flex",
              "transition-[opacity,transform] duration-200",
              inCart
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0",
            )}
          >
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
    </Link>
  );
}
