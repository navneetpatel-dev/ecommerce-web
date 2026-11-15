import { useCallback } from "react";
import { Eye } from "lucide-react";
import { TableRowAction } from "@/shared/components/DataTable/TableRowActions.component";
import { Button } from "@/shared/components/ui/button";
import { tableMenuButtonClass } from "@/shared/constants/table/tableActionTone";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { AdminConfirmAction } from "../../shared/AdminConfirmAction.component";
import type { ProductDetail } from "@/shared/api/types";

interface ProductModerationRowActionsProps {
  product: ProductDetail;
  rowBusy: boolean;
  onApprove: (id: string) => void | Promise<unknown>;
  onReject: (id: string, note: string) => void | Promise<unknown>;
  onPreview: (product: ProductDetail) => void;
}

export function ProductModerationRowActions({
  product,
  rowBusy,
  onApprove,
  onReject,
  onPreview,
}: ProductModerationRowActionsProps) {
  const handlePreview = useCallback(() => {
    onPreview(product);
  }, [onPreview, product]);

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
        <Button
          type="button"
          size="sm"
          variant="outline"
          className={tableMenuButtonClass("neutral")}
          onClick={handlePreview}
          disabled={rowBusy}
        >
          <Eye strokeWidth={2.25} aria-hidden />
          <span>{LABELS.view}</span>
        </Button>
      </TableRowAction>
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
