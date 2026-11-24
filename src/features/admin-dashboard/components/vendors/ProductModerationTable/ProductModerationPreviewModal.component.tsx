"use client";

import { useQuery } from "@tanstack/react-query";
import { Package, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { StatusBadge } from "@/shared/components/badges/StatusBadge.component";
import { LABELS } from "@/shared/constants/labels";
import type { ProductDetail } from "@/shared/api/types";
import { AdminConfirmAction } from "../../shared/AdminConfirmAction.component";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { ProductRecordDetailView } from "@/shared/components/dialogs/product-view/ProductRecordDetailView.component";
import { productsApi } from "@/features/products";

interface ProductModerationPreviewModalProps {
  product: ProductDetail | null;
  onClose: () => void;
  onApprove: (id: string) => void | Promise<unknown>;
  onReject: (id: string, note: string) => void | Promise<unknown>;
  rowBusy?: boolean;
}

export function ProductModerationPreviewModal({
  product,
  onClose,
  onApprove,
  onReject,
  rowBusy = false,
}: ProductModerationPreviewModalProps) {
  const detailQuery = useQuery({
    queryKey: ["products", "detail", product?.id],
    queryFn: () => productsApi.detail(product!.id),
    enabled: Boolean(product?.id),
  });

  if (!product) return null;

  const handleOpenChange = (open: boolean) => {
    if (!open) onClose();
  };

  const handleApprove = async () => {
    await onApprove(product.id);
    onClose();
  };

  const handleReject = async (note?: string) => {
    await onReject(product.id, note ?? "");
    onClose();
  };

  const active = detailQuery.data ?? product;

  const approveDesc = formatLabel(LABELS.confirmApproveProductBody, {
    name: active.name,
  });
  const rejectDesc = formatLabel(LABELS.confirmRejectProductBody, {
    name: active.name,
  });

  return (
    <Dialog open={Boolean(product)} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-h-[92vh] max-w-4xl p-0 flex flex-col gap-0 overflow-hidden sm:rounded-2xl border-line/80 shadow-2xl"
        hideCloseButton
      >
        <div className="flex items-center justify-between border-b border-line/80 bg-surface-subtle/50 px-5 py-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex size-10 items-center justify-center rounded-xl bg-brand/10 text-brand shrink-0">
              <Package className="size-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <DialogTitle className="text-base sm:text-lg font-bold text-ink truncate">
                  {active.name}
                </DialogTitle>
                <StatusBadge status={active.status} />
              </div>
              <p className="text-xs text-ink-muted">
                Pending Product Moderation Review
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label={LABELS.close}
            className="rounded-full size-8 p-0"
          >
            <X className="size-4" />
          </Button>
        </div>

        <div className="overflow-y-auto px-5 py-5 space-y-4 max-h-[calc(92vh-140px)]">
          <ProductRecordDetailView
            product={active as unknown as Record<string, unknown>}
          />
        </div>

        <DialogFooter className="flex-wrap items-center justify-between gap-3 border-t border-line/80 bg-surface-subtle/30 px-5 py-3.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="rounded-xl"
          >
            {LABELS.close}
          </Button>

          <div className="flex items-center gap-2.5">
            <AdminConfirmAction
              label={LABELS.reject}
              tone="danger"
              inline
              dialogVariant="danger"
              title={LABELS.confirmRejectProductTitle}
              description={rejectDesc}
              confirmLabel={LABELS.reject}
              requireReason
              reasonLabel={LABELS.rejectionNote}
              reasonHint={LABELS.enterRejectionNote}
              onConfirm={handleReject}
              disabled={rowBusy}
            />
            <AdminConfirmAction
              label={LABELS.approve}
              tone="success"
              inline
              dialogVariant="success"
              title={LABELS.confirmApproveProductTitle}
              description={approveDesc}
              confirmLabel={LABELS.approve}
              onConfirm={handleApprove}
              disabled={rowBusy}
            />
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
