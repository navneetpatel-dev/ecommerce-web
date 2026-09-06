"use client";

import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatLabel";
import type { OrderItem } from "@/shared/api/types";
import { useBuyAgain } from "../hooks/useBuyAgain.hook";

interface BuyAgainButtonProps {
  items: OrderItem[];
}

/** Re-adds every item on this order/suborder to the cart in one click. */
export function BuyAgainButton({ items }: BuyAgainButtonProps) {
  const { buyAgain, isPending, result } = useBuyAgain();

  const summary = (() => {
    if (!result) return null;
    if (result.addedCount === 0) return LABELS.buyAgainNoneAvailable;
    if (result.unavailableNames.length === 0) {
      return formatLabel(LABELS.buyAgainAllAdded, { total: result.totalCount });
    }
    return formatLabel(LABELS.buyAgainPartial, {
      added: result.addedCount,
      total: result.totalCount,
      names: result.unavailableNames.join(", "),
    });
  })();

  return (
    <div className="space-y-1.5">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isPending || items.length === 0}
        onClick={() => void buyAgain(items)}
      >
        {isPending ? LABELS.buyAgainAdding : LABELS.buyAgain}
      </Button>
      {summary ? (
        <p className="text-body-sm text-ink-muted">{summary}</p>
      ) : null}
    </div>
  );
}
