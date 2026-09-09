import { memo } from "react";
import type { SubOrder } from "@/shared/api/types";
import { LABELS } from "@/shared/constants/labels";
import { Button } from "@/shared/components/ui/button";
import { ORDER_SUMMARY_ASIDE_STYLES } from "./orderSummaryAside.styles";

interface SubOrderInvoicesListProps {
  subOrders: SubOrder[];
  invoicePending: boolean;
  pendingSubOrderId: string | null;
  onDownloadSubOrderInvoice: (subOrderId: string) => void;
}

export const SubOrderInvoicesList = memo(function SubOrderInvoicesList({
  subOrders,
  invoicePending,
  pendingSubOrderId,
  onDownloadSubOrderInvoice,
}: SubOrderInvoicesListProps) {
  return (
    <>
      {subOrders.map((sub) => {
        const handleClick = () => onDownloadSubOrderInvoice(sub.id);
        const invoiceLabel = sub.taxInvoiceNumber
          ? ` · ${sub.taxInvoiceNumber}`
          : "";
        const vendorName = sub.vendor?.businessName ?? LABELS.sellerFallback;

        return (
          <Button
            key={sub.id}
            type="button"
            variant="outline"
            className={ORDER_SUMMARY_ASIDE_STYLES.fullWidthButton}
            onClick={handleClick}
            loading={invoicePending && pendingSubOrderId === sub.id}
            disabled={!sub.taxInvoiceNumber || invoicePending}
          >
            {vendorName}
            {invoiceLabel}
          </Button>
        );
      })}
    </>
  );
});
