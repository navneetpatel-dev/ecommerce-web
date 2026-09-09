"use client";

import Link from "next/link";
import { PATHS } from "@/shared/constants/paths/paths";
import { QuantitySelector } from "@/shared/components/QuantitySelector.component";
import { MediaImage } from "@/shared/components/MediaImage.component";
import { InlineAmountSkeleton } from "@/shared/components/InlineAmountSkeleton.component";
import { Badge } from "@/shared/components/ui/badge";
import { MAX_CART_LINE_QUANTITY } from "@/shared/constants/cart/cart";
import { LABELS } from "@/shared/constants/labels";
import { formatInrAmount } from "@/shared/utils/formatting/orderFormat";
import type { CartItem } from "@/shared/api/types";
import { RemoveLineButton } from "./cartLineShared.component";
import { useCartLineViewModel } from "./useCartLineViewModel.hook";
import { cartLineStyles as styles } from "./cartLine.styles";

interface CompactCartLineProps {
  item: CartItem;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  /** Cart request failed — the amount is missing for good, not mid-refresh. */
  amountsUnavailable?: boolean;
  disabled?: boolean;
}

export function CompactCartLine(props: CompactCartLineProps) {
  const {
    item,
    onUpdateQuantity,
    onRemoveItem,
    amountsUnavailable = false,
    disabled = false,
  } = props;

  const {
    available,
    linePending,
    lineTotal,
    unavailableReasonText,
    handleQuantityChange,
  } = useCartLineViewModel({ item, onUpdateQuantity });

  const isPendingOrNull = linePending || lineTotal == null;

  return (
    <div className={styles.compactRoot(available)}>
      <div className={styles.compactImageWrapper}>
        <MediaImage
          src={item.product.imageUrl}
          alt={item.product.name}
          sizes="56px"
          imageClassName="object-cover"
        />
      </div>

      <div className={styles.compactGrid}>
        <Link
          href={PATHS.product(item.product.slug)}
          className={styles.compactTitle}
        >
          {item.product.name}
        </Link>

        <RemoveLineButton
          item={item}
          className={styles.compactRemoveButton}
          onRemoveItem={onRemoveItem}
          disabled={disabled}
        />

        {available ? (
          <p className={styles.compactAmount(isPendingOrNull)}>
            {lineTotal != null && !linePending ? (
              <>₹{formatInrAmount(lineTotal)}</>
            ) : amountsUnavailable ? (
              LABELS.amountUnavailable
            ) : (
              <InlineAmountSkeleton className={styles.compactSkeleton} />
            )}
          </p>
        ) : (
          <Badge variant="destructive" className={styles.compactBadge}>
            {unavailableReasonText}
          </Badge>
        )}

        {available ? (
          <QuantitySelector
            value={item.quantity}
            onChange={handleQuantityChange}
            min={1}
            max={item.maxQuantity ?? MAX_CART_LINE_QUANTITY}
            disabled={disabled}
            disabledHint={LABELS.cartUpdatingActionHint}
            controlClassName={styles.compactQuantityControl}
            valueClassName={styles.compactQuantityValue}
          />
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
