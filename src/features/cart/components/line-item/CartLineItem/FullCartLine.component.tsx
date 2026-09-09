"use client";

import Link from "next/link";
import { PATHS } from "@/shared/constants/paths/paths";
import { LABELS } from "@/shared/constants/labels";
import { QuantitySelector } from "@/shared/components/QuantitySelector.component";
import { InlineAmountSkeleton } from "@/shared/components/InlineAmountSkeleton.component";
import { MediaImage } from "@/shared/components/MediaImage.component";
import { Badge } from "@/shared/components/ui/badge";
import { MAX_CART_LINE_QUANTITY } from "@/shared/constants/cart/cart";
import { formatInrAmount } from "@/shared/utils/formatting/orderFormat";
import type { CartItem } from "@/shared/api/types";
import { RemoveCartItemAction } from "../../actions/RemoveCartItemAction.component";
import { useCartLineViewModel } from "./useCartLineViewModel.hook";
import { cartLineStyles as styles } from "./cartLine.styles";

interface FullCartLineProps {
  item: CartItem;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  disabled?: boolean;
}

export function FullCartLine(props: FullCartLineProps) {
  const { item, onUpdateQuantity, onRemoveItem, disabled = false } = props;

  const {
    available,
    linePending,
    lineTotal,
    attrs,
    eachPrice,
    unavailableReasonText,
    handleQuantityChange,
  } = useCartLineViewModel({ item, onUpdateQuantity });

  const imageLinkTabIndex = available ? undefined : -1;

  return (
    <li className={styles.fullRoot(available)}>
      <Link
        href={PATHS.product(item.product.slug)}
        className={styles.fullImageLink}
        tabIndex={imageLinkTabIndex}
      >
        <MediaImage
          src={item.product.imageUrl}
          alt={item.product.name}
          sizes="88px"
          imageClassName={styles.fullImage}
        />
      </Link>

      <div className={styles.fullDetailsColumn}>
        <div className={styles.fullHeaderRow}>
          <div className={styles.fullHeaderInfo}>
            <Link
              href={PATHS.product(item.product.slug)}
              className={styles.fullTitle}
            >
              {item.product.name}
            </Link>
            {attrs && <p className={styles.fullAttributes}>{attrs}</p>}
            {available ? (
              <p className={styles.fullMobileEachPrice}>
                ₹{formatInrAmount(Number(item.product.price))} {LABELS.each}
              </p>
            ) : (
              <Badge variant="destructive" className={styles.fullBadge}>
                {unavailableReasonText}
              </Badge>
            )}
          </div>
          <RemoveCartItemAction
            item={item}
            className={styles.fullMobileRemoveButton}
            disabled={disabled}
            onRemoveItem={onRemoveItem}
          />
        </div>

        <div className={styles.fullActionsRow}>
          {available && (
            <QuantitySelector
              value={item.quantity}
              onChange={handleQuantityChange}
              min={1}
              max={item.maxQuantity ?? MAX_CART_LINE_QUANTITY}
              disabled={disabled}
              disabledHint={LABELS.cartUpdatingActionHint}
              controlClassName={styles.fullQuantityControl}
              valueClassName={styles.fullQuantityValue}
            />
          )}
          <RemoveCartItemAction
            item={item}
            display="label"
            className={styles.fullDesktopRemoveButton}
            disabled={disabled}
            onRemoveItem={onRemoveItem}
          />
        </div>
      </div>

      {available ? (
        <div className={styles.fullAmountColumn}>
          {linePending || lineTotal == null ? (
            <InlineAmountSkeleton className={styles.fullAmountSkeleton} />
          ) : (
            <p className={styles.fullTotalAmount}>
              ₹{formatInrAmount(lineTotal)}
            </p>
          )}
          <p className={styles.fullEachPrice}>{eachPrice}</p>
        </div>
      ) : (
        <div className={styles.fullEmptyAmountSpacer} />
      )}
    </li>
  );
}
