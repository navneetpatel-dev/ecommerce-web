import type { OrderItem } from "@/shared/api/types";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { formatInr } from "../../utils/format";

interface SubOrderCardItemsProps {
  items: OrderItem[] | undefined;
  canReturn: boolean;
  onOpenReturn: (item: OrderItem) => void;
}

export function SubOrderCardItems({
  items,
  canReturn,
  onOpenReturn,
}: SubOrderCardItemsProps) {
  return (
    <ul className="divide-y divide-line">
      {items?.map((item) => (
        <li
          key={item.id}
          className="flex items-start justify-between gap-4 py-3.5 text-[0.875rem]"
        >
          <div className="min-w-0">
            <p className="font-medium text-ink">{item.productName}</p>
            <p className="mt-0.5 text-body-sm text-ink-muted">
              Qty {item.quantity}
            </p>
            {canReturn ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="mt-2 h-auto px-0 text-brand hover:text-brand-hover"
                onClick={() => onOpenReturn(item)}
              >
                {LABELS.requestReturn}
              </Button>
            ) : null}
          </div>
          <div className="shrink-0 text-right">
            <p className="font-display text-body-lg tabular-nums text-ink">
              {formatInr(Number(item.unitPrice) * Number(item.quantity))}
            </p>
            {item.quantity > 1 && (
              <p className="mt-0.5 text-[0.75rem] text-ink-muted">
                {formatInr(Number(item.unitPrice))} each
              </p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
