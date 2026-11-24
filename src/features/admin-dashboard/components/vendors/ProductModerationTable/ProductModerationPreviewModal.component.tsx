"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
import { ProductModerationSpecs } from "./ProductModerationSpecs.component";
import { ProductModerationGallery } from "./ProductModerationGallery.component";
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
  const [activeImageIdx, setActiveImageIdx] = useState(0);

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
  const vendorName = active.vendor?.businessName || "—";
  const categoryName = active.category?.name || active.categoryName || "—";

  const allImages: string[] = [];
  if (active.imageUrl) allImages.push(active.imageUrl);
  if (Array.isArray(active.images)) {
    for (const img of active.images) {
      const url = typeof img === "string" ? img : img?.url;
      if (url && !allImages.includes(url)) allImages.push(url);
    }
  }

  const approveDesc = formatLabel(LABELS.confirmApproveProductBody, {
    name: active.name,
  });
  const rejectDesc = formatLabel(LABELS.confirmRejectProductBody, {
    name: active.name,
  });

  return (
    <Dialog open={Boolean(product)} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-heading-sm font-semibold text-ink">
            {active.name}
          </DialogTitle>
          <DialogDescription className="text-body-sm text-ink-muted">
            {LABELS.productPreviewTitle}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <ProductModerationGallery
            images={allImages}
            activeIdx={activeImageIdx}
            productName={active.name}
            loading={detailQuery.isLoading}
            onSelectIdx={setActiveImageIdx}
          />

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
                {formatInr(active.basePrice)}
              </span>
            </div>
          </div>

          {active.description && (
            <div className="space-y-1">
              <h4 className="text-body-sm font-semibold text-ink">
                {LABELS.productPreviewDescription}
              </h4>
              <p className="whitespace-pre-line text-body-sm text-ink-muted">
                {active.description}
              </p>
            </div>
          )}

          <ProductModerationSpecs specs={active.specs} />
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
