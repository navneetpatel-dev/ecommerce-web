"use client";

import { attentionStyles } from "@/shared/styles/attention.styles";
import { Boxes, Eye, Pencil, Rocket, Send } from "lucide-react";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { AdminConfirmAction } from "../shared/AdminConfirmAction.component";
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
  /** Super Admin, on a draft platform product (no vendor): publish it directly. */
  canPublish?: boolean;
  onPublish?: (product: ProductTarget) => void | Promise<unknown>;
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
  canPublish = false,
  onPublish,
}: AdminProductRowActionsProps) {
  const handlePreview = () => onPreview(product);
  const handleEdit = () => onEdit(product.id);
  const handleVariants = () => onManageVariants(product);
  const handleSubmit = () => onSubmitOnBehalf(product);
  const handlePublish = () => void onPublish?.(product);
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
      {canPublish ? (
        <AdminConfirmAction
          label={LABELS.publishPlatformProduct}
          icon={Rocket}
          dialogVariant="success"
          tone="success"
          title={formatLabel(LABELS.publishPlatformProductTitle, {
            name: product.name,
          })}
          description={LABELS.publishPlatformProductBody}
          onConfirm={handlePublish}
        />
      ) : null}
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
