import { memo } from "react";
import Link from "next/link";
import type { OrderItem } from "@/shared/api/types";
import { Button } from "@/shared/components/ui/button";
import { MediaImage } from "@/shared/components/MediaImage.component";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths";
import { formatLabel } from "@/shared/utils/formatLabel";
import { formatInr } from "../../utils/format";
import { orderLineVariantLabel } from "../../utils/orderLine.utils";
import { SUB_ORDER_CARD_ITEMS_STYLES } from "./subOrderCardItems.styles";

interface SubOrderCardItemRowProps {
  item: OrderItem;
  canReturn: boolean;
  onOpenReturn: (item: OrderItem) => void;
}

export const SubOrderCardItemRow = memo(function SubOrderCardItemRow({
  item,
  canReturn,
  onOpenReturn,
}: SubOrderCardItemRowProps) {
  const attrs = orderLineVariantLabel(item);
  const handleReturnClick = () => onOpenReturn(item);
  const subtotalFormatted = formatInr(item.lineSubtotal);
  const qtyFormatted = formatLabel(LABELS.qtyLabel, {
    count: String(item.quantity),
  });

  return (
    <li className={SUB_ORDER_CARD_ITEMS_STYLES.itemRow}>
      <div className={SUB_ORDER_CARD_ITEMS_STYLES.imageWrapper}>
        <MediaImage
          src={item.imageUrl}
          alt={item.productName}
          sizes="88px"
          imageClassName="object-cover"
        />
      </div>

      <div className={SUB_ORDER_CARD_ITEMS_STYLES.detailsCol}>
        {item.productSlug ? (
          <Link
            href={PATHS.product(item.productSlug)}
            className={SUB_ORDER_CARD_ITEMS_STYLES.productLink}
          >
            {item.productName}
          </Link>
        ) : (
          <p className={SUB_ORDER_CARD_ITEMS_STYLES.productName}>
            {item.productName}
          </p>
        )}

        {attrs ? (
          <p className={SUB_ORDER_CARD_ITEMS_STYLES.variantAttrs}>{attrs}</p>
        ) : null}

        <p className={SUB_ORDER_CARD_ITEMS_STYLES.quantityText}>
          {qtyFormatted}
        </p>

        <p className={SUB_ORDER_CARD_ITEMS_STYLES.subtotalMobile}>
          {subtotalFormatted}
        </p>

        {canReturn ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={SUB_ORDER_CARD_ITEMS_STYLES.returnButton}
            onClick={handleReturnClick}
          >
            {LABELS.requestReturn}
          </Button>
        ) : null}
      </div>

      <div className={SUB_ORDER_CARD_ITEMS_STYLES.desktopPricingCol}>
        <p className={SUB_ORDER_CARD_ITEMS_STYLES.subtotalDesktop}>
          {subtotalFormatted}
        </p>
        {item.quantity > 1 ? (
          <p className={SUB_ORDER_CARD_ITEMS_STYLES.unitPrice}>
            {formatInr(Number(item.unitPrice))} {LABELS.each}
          </p>
        ) : null}
      </div>
    </li>
  );
});
