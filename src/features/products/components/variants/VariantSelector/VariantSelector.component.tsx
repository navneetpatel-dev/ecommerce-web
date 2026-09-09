import { VARIANT_LOW_STOCK_DEFAULT } from "../../../constants/listing-form/productFields";
import { variantSelectorStyles } from "./variantSelector.styles";
import { VariantAttributeGroupsList } from "./VariantAttributeGroupsList.component";
import { VariantPriceStockSection } from "./VariantPriceStockSection.component";

export interface VariantSelectorProps {
  attributeGroups: Record<string, string[]>;
  currentPrice: number;
  currentStock: number;
  basePrice: number;
  hasPriceChange: boolean;
  isAvailable: (key: string, value: string) => boolean;
  isActive: (key: string, value: string) => boolean;
  onSelectValue: (key: string, value: string) => void;
  /** When true, shows Add to Cart (legacy). Prefer page-level ATC. */
  showAddToCart?: boolean;
  /** Hide price/stock block when the parent buy box already shows them. */
  optionsOnly?: boolean;
  onAddToCart?: () => void;
  isAddingToCart?: boolean;
  canAddToCart?: boolean;
  lowStockAt?: number;
  freeShippingThreshold?: number;
  className?: string;
}

export function VariantSelector({
  attributeGroups,
  currentPrice,
  currentStock,
  basePrice,
  hasPriceChange,
  isAvailable,
  isActive,
  onSelectValue,
  showAddToCart = false,
  optionsOnly = false,
  onAddToCart,
  isAddingToCart,
  canAddToCart = true,
  lowStockAt = VARIANT_LOW_STOCK_DEFAULT,
  freeShippingThreshold,
  className,
}: VariantSelectorProps) {
  const hasAttributes = Object.keys(attributeGroups).length > 0;

  if (!hasAttributes && !showAddToCart) {
    return null;
  }

  return (
    <div className={variantSelectorStyles.root(className)}>
      {hasAttributes ? (
        <VariantAttributeGroupsList
          attributeGroups={attributeGroups}
          isAvailable={isAvailable}
          isActive={isActive}
          onSelectValue={onSelectValue}
        />
      ) : null}

      {!optionsOnly ? (
        <VariantPriceStockSection
          currentPrice={currentPrice}
          currentStock={currentStock}
          basePrice={basePrice}
          hasPriceChange={hasPriceChange}
          showAddToCart={showAddToCart}
          onAddToCart={onAddToCart}
          isAddingToCart={isAddingToCart}
          canAddToCart={canAddToCart}
          lowStockAt={lowStockAt}
          freeShippingThreshold={freeShippingThreshold}
        />
      ) : null}
    </div>
  );
}
