"use client";

import { Button } from "@/shared/components/ui/button";
import { DisabledActionHint } from "@/shared/components/DisabledActionHint.component";
import {
  TableRowActions,
  TableRowAction,
} from "@/shared/components/TableRowActions.component";
import { Pencil, Trash2, Send, Images } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { PRODUCT_STATUS } from "@/shared/constants/statuses";
import { tableMenuButtonClass } from "@/shared/constants/table/tableActionTone";
import type { ProductRowActionsProps } from "../../../types/products/ProductsTable-types";

/** Row/card kebab actions: submit, manage images, edit, delete. */
export function ProductActions(props: ProductRowActionsProps) {
  const {
    product,
    onEdit,
    onDelete,
    onSubmitForApproval,
    onManageImages,
    isDeleting,
    isSubmitting,
  } = props;
  const canSubmit =
    Boolean(onSubmitForApproval) && product.status === PRODUCT_STATUS.DRAFT;
  const handleSubmit = () => onSubmitForApproval?.(product);
  const handleManageImages = () => onManageImages?.(product);
  const handleEdit = () => onEdit?.(product);
  const handleDelete = () => onDelete?.(product);

  return (
    <TableRowActions>
      {canSubmit ? (
        <TableRowAction>
          <DisabledActionHint
            disabled={Boolean(isSubmitting)}
            message={LABELS.submitForApproval}
            block
          >
            <Button
              size="sm"
              variant="outline"
              type="button"
              className={tableMenuButtonClass("success")}
              disabled={isSubmitting}
              onClick={handleSubmit}
            >
              <Send strokeWidth={2.25} aria-hidden />
              <span>{LABELS.submitForApproval}</span>
            </Button>
          </DisabledActionHint>
        </TableRowAction>
      ) : null}
      {onManageImages ? (
        <TableRowAction>
          <Button
            size="sm"
            variant="outline"
            type="button"
            className={tableMenuButtonClass("neutral")}
            onClick={handleManageImages}
          >
            <Images strokeWidth={2.25} aria-hidden />
            <span>{LABELS.manageProductImages}</span>
          </Button>
        </TableRowAction>
      ) : null}
      {onEdit ? (
        <TableRowAction>
          <Button
            size="sm"
            variant="outline"
            type="button"
            className={tableMenuButtonClass("edit")}
            onClick={handleEdit}
          >
            <Pencil strokeWidth={2.25} aria-hidden />
            <span>{LABELS.edit}</span>
          </Button>
        </TableRowAction>
      ) : null}
      {onDelete ? (
        <TableRowAction destructive>
          <DisabledActionHint
            disabled={Boolean(isDeleting)}
            message={LABELS.deletingProductEllipsis}
            block
          >
            <Button
              size="sm"
              variant="outline"
              type="button"
              className={tableMenuButtonClass("danger")}
              disabled={isDeleting}
              onClick={handleDelete}
            >
              <Trash2 strokeWidth={2.25} aria-hidden />
              <span>{LABELS.delete}</span>
            </Button>
          </DisabledActionHint>
        </TableRowAction>
      ) : null}
    </TableRowActions>
  );
}
