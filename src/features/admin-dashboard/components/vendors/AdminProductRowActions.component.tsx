"use client";

import { attentionStyles } from "@/shared/styles/attention.styles";
import { Boxes, Eye, Pencil, Send } from "lucide-react";
import { RowActionButton } from "@/shared/components/DataTable/RowActions/RowActionButton.component";
import { LABELS } from "@/shared/constants/labels";
import { PRODUCT_STATUS } from "@/shared/constants/statuses";
import type { ProductTarget } from "../../hooks/vendors/useAdminProductEditor.hook";

const SUBMITTABLE = new Set<string>([
  PRODUCT_STATUS.DRAFT,
  PRODUCT_STATUS.REJECTED,
]);

interface AdminProductRowActionsProps {
  product: ProductTarget;
  status: string;
  listedByPlatform: boolean;
  onPreview: (product: ProductTarget) => void;
  onEdit: (id: string) => void;
  onManageVariants: (product: ProductTarget) => void;
  onSubmitOnBehalf: (product: ProductTarget) => void;
}

/** Edit, variants and submit-on-behalf for a product row (platform-listed drafts can be submitted for the vendor). */
export function AdminProductRowActions({
  product,
  status,
  listedByPlatform,
  onPreview,
  onEdit,
  onManageVariants,
  onSubmitOnBehalf,
}: AdminProductRowActionsProps) {
  const handlePreview = () => onPreview(product);
  const handleEdit = () => onEdit(product.id);
  const handleVariants = () => onManageVariants(product);
  const handleSubmit = () => onSubmitOnBehalf(product);
  const canSubmit = listedByPlatform && SUBMITTABLE.has(status);

  return (
    <>
      <RowActionButton
        kind="view"
        icon={Eye}
        label={LABELS.previewAsCustomer}
        attentionClassName={attentionStyles.previewRow}
        onClick={handlePreview}
      />
      <RowActionButton
        kind="edit"
        icon={Pencil}
        label={LABELS.edit}
        onClick={handleEdit}
      />
      <RowActionButton
        icon={Boxes}
        label={LABELS.manageVariants}
        attentionClassName={attentionStyles.variantsRow}
        onClick={handleVariants}
      />
      {canSubmit ? (
        <RowActionButton
          icon={Send}
          label={LABELS.submitOnBehalf}
          attentionClassName={attentionStyles.submitRow}
          onClick={handleSubmit}
        />
      ) : null}
    </>
  );
}
