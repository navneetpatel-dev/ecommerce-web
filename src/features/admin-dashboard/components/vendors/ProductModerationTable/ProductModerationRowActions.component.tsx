import { useCallback } from "react";
import { TableRowAction } from "@/shared/components/TableRowActions.component";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { AdminConfirmAction } from "../../shared/AdminConfirmAction.component";

interface Product {
  id: string;
  name: string;
  imageUrl?: string | null;
  basePrice: number;
}

interface ProductModerationRowActionsProps {
  product: Product;
  rowBusy: boolean;
  onApprove: (id: string) => void | Promise<unknown>;
  onReject: (id: string, note: string) => void | Promise<unknown>;
}

export function ProductModerationRowActions({
  product,
  rowBusy,
  onApprove,
  onReject,
}: ProductModerationRowActionsProps) {
  const handleApprove = useCallback(() => {
    void onApprove(product.id);
  }, [onApprove, product.id]);

  const handleReject = useCallback(
    (note?: string) => {
      void onReject(product.id, note ?? "");
    },
    [onReject, product.id],
  );

  const approveDescription = formatLabel(LABELS.confirmApproveProductBody, {
    name: product.name,
  });

  const rejectDescription = formatLabel(LABELS.confirmRejectProductBody, {
    name: product.name,
  });

  return (
    <>
      <TableRowAction>
        <AdminConfirmAction
          label={LABELS.approve}
          tone="success"
          dialogVariant="success"
          title={LABELS.confirmApproveProductTitle}
          description={approveDescription}
          confirmLabel={LABELS.approve}
          onConfirm={handleApprove}
          disabled={rowBusy}
        />
      </TableRowAction>
      <TableRowAction destructive>
        <AdminConfirmAction
          label={LABELS.reject}
          tone="danger"
          dialogVariant="danger"
          title={LABELS.confirmRejectProductTitle}
          description={rejectDescription}
          confirmLabel={LABELS.reject}
          requireReason
          reasonLabel={LABELS.rejectionNote}
          reasonHint={LABELS.enterRejectionNote}
          onConfirm={handleReject}
          disabled={rowBusy}
        />
      </TableRowAction>
    </>
  );
}
