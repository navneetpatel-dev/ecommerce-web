import { memo } from "react";
import type { SubOrder } from "@/shared/api/types";
import { LABELS } from "@/shared/constants/labels";
import { Button } from "@/shared/components/ui/button";
import type { TaxInvoicePartState } from "../../utils/documents/invoiceAvailability.utils";
import { ORDER_SUMMARY_ASIDE_STYLES } from "../../styles/detail/orderSummaryAside.styles";

interface SubOrderInvoicesListProps {
  subOrders: SubOrder[];
  /** Why each part has no download yet; `issued` parts show their invoice number. */
  stateBySubOrder: Record<string, TaxInvoicePartState>;
  invoicePending: boolean;
  pendingSubOrderId: string | null;
  onDownloadSubOrderInvoice: (subOrderId: string) => void;
}

/**
 * A disabled button explains itself in its own label: the panel used to grey out the
 * seller name with no reason, so a customer could not tell a not-yet-shipped part from
 * one that will never be invoiced (a cancelled part is never invoiced).
 */
function partSuffix(sub: SubOrder, state: TaxInvoicePartState): string {
  if (state === "issued") {
    return sub.taxInvoiceNumber ? ` · ${sub.taxInvoiceNumber}` : "";
  }
  if (state === "notApplicable") {
    return ` · ${LABELS.taxInvoiceNotApplicable}`;
  }
  return ` · ${LABELS.taxInvoiceAwaitingDispatch}`;
}

export const SubOrderInvoicesList = memo(function SubOrderInvoicesList({
  subOrders,
  stateBySubOrder,
  invoicePending,
  pendingSubOrderId,
  onDownloadSubOrderInvoice,
}: SubOrderInvoicesListProps) {
  return (
    <>
      {subOrders.map((sub) => {
        const handleClick = () => onDownloadSubOrderInvoice(sub.id);
        const state = stateBySubOrder[sub.id] ?? "awaitingDispatch";
        const vendorName = sub.vendor?.businessName ?? LABELS.sellerFallback;

        return (
          <Button
            key={sub.id}
            type="button"
            variant="outline"
            className={ORDER_SUMMARY_ASIDE_STYLES.fullWidthButton}
            onClick={handleClick}
            loading={invoicePending && pendingSubOrderId === sub.id}
            disabled={state !== "issued" || invoicePending}
          >
            {vendorName}
            {partSuffix(sub, state)}
          </Button>
        );
      })}
    </>
  );
});
