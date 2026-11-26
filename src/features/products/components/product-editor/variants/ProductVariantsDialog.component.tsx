"use client";

import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { LABELS } from "@/shared/constants/labels";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { usePermissions } from "@/shared/hooks/auth/usePermissions.hook";
import { useProductVariantsDialog } from "../../../hooks/product-editor/useProductVariantsDialog.hook";
import { variantsEditorStyles } from "../../../styles/product-editor/variantsEditor.styles";
import { PriceChangeReasonField } from "../PriceChangeReasonField.component";
import { ExistingVariantList } from "./ExistingVariantList.component";
import { NewVariantList } from "./NewVariantList.component";

interface ProductVariantsDialogProps {
  productId: string;
  productName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChanged?: () => void;
}

/** Manage a saved product's variants: edit price, stock and options, add and (with product.delete) remove. */
export function ProductVariantsDialog({
  productId,
  productName,
  open,
  onOpenChange,
  onChanged,
}: ProductVariantsDialogProps) {
  const { hasPermission } = usePermissions();
  const canDelete = hasPermission(PERMISSIONS.PRODUCT_DELETE);
  const dialog = useProductVariantsDialog({ productId, open, onChanged });
  const priceLocked = dialog.pricing.lock.locked;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={variantsEditorStyles.dialogContent}>
        <DialogHeader>
          <DialogTitle>
            {formatLabel(LABELS.variantsTitle, { name: productName })}
          </DialogTitle>
          <DialogDescription>{LABELS.variantsBody}</DialogDescription>
        </DialogHeader>

        {dialog.error ? (
          <p role="alert" className="text-sm text-danger">
            {dialog.error}
          </p>
        ) : null}
        {priceLocked && dialog.pricing.lock.hint ? (
          <p className={variantsEditorStyles.empty}>
            {dialog.pricing.lock.hint}
          </p>
        ) : null}

        <div className={variantsEditorStyles.reasonBox}>
          <PriceChangeReasonField
            disabled={dialog.busyKey !== null}
            reason={{
              required: dialog.pricing.reasonRequired,
              value: dialog.reason,
              error: dialog.reasonError,
              onChange: dialog.handleReasonChange,
            }}
          />
        </div>

        {dialog.loading ? (
          <Skeleton className="h-16 w-full rounded-md" />
        ) : (
          <div className={variantsEditorStyles.stack}>
            {dialog.rows.length === 0 && dialog.newRows.length === 0 ? (
              <p className={variantsEditorStyles.empty}>
                {LABELS.noVariantsYet}
              </p>
            ) : null}
            <ExistingVariantList
              rows={dialog.rows}
              busyKey={dialog.busyKey}
              priceLocked={priceLocked}
              canDelete={canDelete}
              onPatch={dialog.patchExisting}
              onSave={dialog.saveExisting}
              onRemove={dialog.removeExisting}
            />
            <NewVariantList
              rows={dialog.newRows}
              errors={dialog.rowErrors}
              busyKey={dialog.busyKey}
              priceLocked={priceLocked}
              onPatch={dialog.patchNew}
              onSave={dialog.saveNew}
              onDiscard={dialog.discardNew}
            />
            <div className={variantsEditorStyles.actions}>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={priceLocked}
                onClick={dialog.addNewRow}
              >
                <Plus aria-hidden />
                <span>{LABELS.addVariant}</span>
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
