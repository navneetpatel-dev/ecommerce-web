import type { ProductListItem } from "@/shared/api/types";

export interface ProductCardProps {
  product: ProductListItem;
  quickAddLabel?: string;
  showWishlist?: boolean;
  showQuickAdd?: boolean;
  compareMode?: boolean;
  isCompared?: boolean;
  compareAtLimit?: boolean;
  isWishlisted?: boolean;
  isAddingToCart?: boolean;
  cartQuantity?: number;
  maxQuantity?: number;
  showMrp?: boolean;
  discountPercent?: number;
  onPrefetch?: () => void;
  onToggleWishlist?: () => void;
  onAddToCart?: () => void;
  onQuantityChange?: (quantity: number) => void;
  onToggleCompare?: (product: ProductListItem) => void;
}
