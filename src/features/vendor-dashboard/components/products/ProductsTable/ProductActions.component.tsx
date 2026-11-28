"use client";

import { attentionStyles } from "@/shared/styles/attention.styles";
import { TableRowActions } from "@/shared/components/DataTable/TableRowActions.component";
import { RowActionButton } from "@/shared/components/DataTable/RowActions/RowActionButton.component";
import { Pencil, Trash2, Send, Images, Boxes, Eye } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { PRODUCT_STATUS } from "@/shared/constants/statuses";
import type { ProductRowActionsProps } from "../../../types/products/ProductsTable-types";

/** Row/card kebab actions: submit, manage images, edit, delete. */
export function ProductActions(props: ProductRowActionsProps) {
  const {
    product,
    onEdit,
    onDelete,
    onSubmitForApproval,
    onPreview,
    onManageImages,
    onManageVariants,
    isDeleting,
    isSubmitting,
  } = props;
  const rejected = product.status === PRODUCT_STATUS.REJECTED;
  const canSubmit =
    Boolean(onSubmitForApproval) &&
    (rejected || product.status === PRODUCT_STATUS.DRAFT);
  const submitLabel = rejected
    ? LABELS.resubmitForApproval
    : LABELS.submitForApproval;
  const handleSubmit = () => onSubmitForApproval?.(product);
  const handlePreview = () => onPreview?.(product);
  const handleManageImages = () => onManageImages?.(product);
  const handleManageVariants = () => onManageVariants?.(product);
  const handleEdit = () => onEdit?.(product);
  const handleDelete = () => onDelete?.(product);

  return (
    <TableRowActions>
      {onPreview ? (
        <RowActionButton
          kind="view"
          icon={Eye}
          label={LABELS.previewAsCustomer}
          attentionClassName={attentionStyles.previewRow}
          onClick={handlePreview}
        />
      ) : null}
      {canSubmit ? (
        <RowActionButton
          icon={Send}
          label={submitLabel}
          attentionClassName={attentionStyles.submitRow}
          loading={isSubmitting}
          onClick={handleSubmit}
        />
      ) : null}
      {onManageImages ? (
        <RowActionButton
          icon={Images}
          label={LABELS.manageProductImages}
          attentionClassName={attentionStyles.imagesRow}
          onClick={handleManageImages}
        />
      ) : null}
      {onManageVariants ? (
        <RowActionButton
          icon={Boxes}
          label={LABELS.manageVariants}
          attentionClassName={attentionStyles.variantsRow}
          onClick={handleManageVariants}
        />
      ) : null}
      {onEdit ? (
        <RowActionButton
          kind="edit"
          icon={Pencil}
          label={LABELS.edit}
          onClick={handleEdit}
        />
      ) : null}
      {onDelete ? (
        <RowActionButton
          kind="danger"
          icon={Trash2}
          label={LABELS.delete}
          loading={isDeleting}
          onClick={handleDelete}
        />
      ) : null}
    </TableRowActions>
  );
}
