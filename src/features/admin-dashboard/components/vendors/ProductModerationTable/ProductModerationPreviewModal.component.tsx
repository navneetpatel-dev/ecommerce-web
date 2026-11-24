"use client";

import { useState } from "react";
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
import { ProductModerationSpecs } from "./ProductModerationSpecs.component";

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

  const allImages: string[] = [];
  if (product.imageUrl) allImages.push(product.imageUrl);
  if (Array.isArray(product.images)) {
    for (const img of product.images) {
      const url = typeof img === "string" ? img : img?.url;
      if (url && !allImages.includes(url)) allImages.push(url);
    }
  }

  const currentImage = allImages[activeImageIdx] || allImages[0];
  const approveDesc = formatLabel(LABELS.confirmApproveProductBody, {
    name: product.name,
  });
  const rejectDesc = formatLabel(LABELS.confirmRejectProductBody, {
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
          {currentImage && (
            <div className="space-y-2">
              <div className="relative aspect-video w-full overflow-hidden rounded-md border border-line bg-paper">
                <Image
                  src={currentImage}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 600px"
                  className="object-contain"
                />
              </div>

              {allImages.length > 1 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {allImages.map((imgUrl, idx) => (
                    <button
                      key={imgUrl}
                      type="button"
                      onClick={() => setActiveImageIdx(idx)}
                      className={`relative h-14 w-14 overflow-hidden rounded border transition-all ${
                        activeImageIdx === idx
                          ? "border-brand ring-2 ring-brand/30"
                          : "border-line opacity-75 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={imgUrl}
                        alt={`Photo ${idx + 1}`}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
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

          <ProductModerationSpecs specs={product.specs} />
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
