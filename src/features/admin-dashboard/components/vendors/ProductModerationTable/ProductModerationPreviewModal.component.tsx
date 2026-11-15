"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { formatInr } from "@/shared/utils/formatting/orderFormat";
import type { ProductDetail } from "@/shared/api/types";
import { AdminConfirmAction } from "../../shared/AdminConfirmAction.component";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";

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

  const vendorName = product.vendor?.businessName || "—";
  const categoryName = product.category?.name || product.categoryName || "—";
  const primaryImage = product.imageUrl || product.images?.[0]?.url;

  const approveDescription = formatLabel(LABELS.confirmApproveProductBody, {
    name: product.name,
  });

  const rejectDescription = formatLabel(LABELS.confirmRejectProductBody, {
    name: product.name,
  });

  return (
    <Dialog open={Boolean(product)} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-heading-sm font-semibold text-ink">
            {product.name}
          </DialogTitle>
          <DialogDescription className="text-body-sm text-ink-muted">
            {LABELS.productPreviewTitle}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {primaryImage && (
            <div className="relative aspect-video w-full overflow-hidden rounded-md border border-line bg-paper">
              <Image
                src={primaryImage}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                className="object-contain"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 rounded-md border border-line/60 bg-paper/40 p-3 text-body-sm">
            <div>
              <span className="font-medium text-ink-muted">
                {LABELS.productPreviewVendor}:
              </span>{" "}
              <span className="font-semibold text-ink">{vendorName}</span>
            </div>
            <div>
              <span className="font-medium text-ink-muted">
                {LABELS.productPreviewCategory}:
              </span>{" "}
              <span className="font-semibold text-ink">{categoryName}</span>
            </div>
            <div>
              <span className="font-medium text-ink-muted">
                {LABELS.productPreviewPricing}:
              </span>{" "}
              <span className="font-semibold text-ink">
                {formatInr(product.basePrice)}
              </span>
            </div>
          </div>

          {product.description && (
            <div className="space-y-1">
              <h4 className="text-body-sm font-semibold text-ink">
                {LABELS.productPreviewDescription}
              </h4>
              <p className="whitespace-pre-line text-body-sm text-ink-muted">
                {product.description}
              </p>
            </div>
          )}

          {product.specs && Object.keys(product.specs).length > 0 && (
            <div className="space-y-2">
              <h4 className="text-body-sm font-semibold text-ink">
                {LABELS.productPreviewSpecifications}
              </h4>
              <dl className="grid grid-cols-2 gap-2 text-body-xs">
                {Object.entries(product.specs).map(([key, val]) => (
                  <div key={key} className="rounded border border-line/40 p-2">
                    <dt className="text-ink-muted">{key}</dt>
                    <dd className="font-medium text-ink">{val}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>

        <DialogFooter className="flex-wrap items-center justify-between gap-2 border-t border-line/60 pt-4">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            {LABELS.close}
          </Button>

          <div className="flex items-center gap-2">
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
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
