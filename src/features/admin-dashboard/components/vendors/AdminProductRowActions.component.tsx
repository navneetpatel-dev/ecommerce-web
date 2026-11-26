"use client";

import { cn } from "@/shared/utils/dom/cn";
import { attentionStyles } from "@/shared/styles/attention.styles";
import { Boxes, Eye, Pencil, Send } from "lucide-react";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { AdminConfirmAction } from "../shared/AdminConfirmAction.component";
import { Button } from "@/shared/components/ui/button";
import { TableRowAction } from "@/shared/components/DataTable/TableRowActions.component";
import { LABELS } from "@/shared/constants/labels";
import { PRODUCT_STATUS } from "@/shared/constants/statuses";
import { tableMenuButtonClass } from "@/shared/constants/table/tableActionTone";
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
      <TableRowAction>
        <Button
          size="sm"
          variant="outline"
          type="button"
          className={cn(
            tableMenuButtonClass("neutral"),
            attentionStyles.previewRow,
          )}
          onClick={handlePreview}
        >
          <Eye strokeWidth={2.25} aria-hidden />
          <span>{LABELS.previewAsCustomer}</span>
        </Button>
      </TableRowAction>
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
      <TableRowAction>
        <Button
          size="sm"
          variant="outline"
          type="button"
          className={cn(
            tableMenuButtonClass("neutral"),
            attentionStyles.variantsRow,
          )}
          onClick={handleVariants}
        >
          <Boxes strokeWidth={2.25} aria-hidden />
          <span>{LABELS.manageVariants}</span>
        </Button>
      </TableRowAction>
      {canPublish ? (
        <TableRowAction>
          <AdminConfirmAction
            label={LABELS.publishPlatformProduct}
            dialogVariant="info"
            tone="success"
            title={formatLabel(LABELS.publishPlatformProductTitle, {
              name: product.name,
            })}
            description={LABELS.publishPlatformProductBody}
            onConfirm={handlePublish}
          />
        </TableRowAction>
      ) : null}
      {canSubmit ? (
        <TableRowAction>
          <Button
            size="sm"
            variant="outline"
            type="button"
            className={cn(
              tableMenuButtonClass("success"),
              attentionStyles.submitRow,
            )}
            onClick={handleSubmit}
          >
            <Send strokeWidth={2.25} aria-hidden />
            <span>{LABELS.submitOnBehalf}</span>
          </Button>
        </TableRowAction>
      ) : null}
    </>
  );
}
