import Link from "next/link";
import type { OrderItem } from "@/shared/api/types";
import { Button } from "@/shared/components/ui/button";
import { MediaImage } from "@/shared/components/MediaImage.component";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths";
import { formatLabel } from "@/shared/utils/formatLabel";
import { formatInr } from "../../utils/format";
import { orderLineVariantLabel } from "../../utils/orderLine.utils";

interface SubOrderCardItemsProps {
  items: OrderItem[] | undefined;
  canReturn: boolean;
  onOpenReturn: (item: OrderItem) => void;
}

/** Order lines, laid out like cart lines so an item reads the same throughout. */
export function SubOrderCardItems({
  items,
  canReturn,
  onOpenReturn,
}: SubOrderCardItemsProps) {
  const nameClassName =
    "block text-body font-medium leading-snug text-ink transition-colors";

  return (
    <ul className="divide-y divide-line">
      {items?.map((item) => {
        const attrs = orderLineVariantLabel(item);
        return (
          <li
            key={item.id}
            className="grid grid-cols-[3.5rem_1fr] items-start gap-3 py-3 sm:grid-cols-[4rem_1fr_auto] sm:gap-4"
          >
            {/* MediaImage renders <Image fill>, which is absolutely positioned —
                this wrapper must stay `relative` or the thumbnail escapes it. */}
            <div className="relative aspect-square self-start overflow-hidden rounded-sm border border-line bg-paper">
              <MediaImage
                src={item.imageUrl}
                alt={item.productName}
                sizes="88px"
                imageClassName="object-cover"
              />
            </div>

            <div className="flex min-w-0 flex-col gap-0.5">
              {item.productSlug ? (
                <Link
                  href={PATHS.product(item.productSlug)}
                  className={`${nameClassName} hover:text-brand`}
                >
                  {item.productName}
                </Link>
              ) : (
                <p className={nameClassName}>{item.productName}</p>
              )}

              {attrs ? (
                <p className="font-mono text-[0.6875rem] tracking-wide text-ink-muted">
                  {attrs}
                </p>
              ) : null}

              <p className="mt-1 text-body-sm text-ink-muted">
                {formatLabel(LABELS.qtyLabel, { count: String(item.quantity) })}
              </p>

              <p className="mt-1 font-display text-[1.125rem] tabular-nums text-ink sm:hidden">
                {formatInr(item.lineSubtotal)}
              </p>

              {canReturn ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="mt-1 h-auto min-h-0 max-h-none self-start px-0 py-0 text-body-sm text-brand hover:bg-transparent hover:text-brand-hover"
                  onClick={() => onOpenReturn(item)}
                >
                  {LABELS.requestReturn}
                </Button>
              ) : null}
            </div>

            <div className="hidden flex-col items-end gap-1 sm:flex">
              <p className="font-display text-[1.125rem] tabular-nums text-ink">
                {formatInr(item.lineSubtotal)}
              </p>
              {item.quantity > 1 ? (
                <p className="text-[0.75rem] tabular-nums text-ink-muted">
                  {formatInr(Number(item.unitPrice))} {LABELS.each}
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
