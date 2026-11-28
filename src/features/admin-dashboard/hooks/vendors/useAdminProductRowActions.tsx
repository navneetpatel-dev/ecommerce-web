"use client";

import { ArchiveRestore } from "lucide-react";
import { useCallback, type ReactNode } from "react";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { adminApi } from "../../api/analytics/admin.api";
import { AdminProductRowActions } from "../../components/vendors/AdminProductRowActions.component";
import { AdminConfirmAction } from "../../components/shared/AdminConfirmAction.component";
import { adminRowLabel } from "../../utils/shared/adminRowLabel";
import type { AdminDataRow } from "../shared/useAdminDataList.hook";
import type { useAdminProductEditor } from "./useAdminProductEditor.hook";

/** What an admin can do with one product row: preview, edit, variants, submit, archive. */
export function useAdminProductRowActions(
  editor: ReturnType<typeof useAdminProductEditor>,
) {
  const actions = useCallback(
    (row: AdminDataRow, reload: () => void): ReactNode => {
      const name = adminRowLabel(row);
      const isArchived = row.status === "ARCHIVED";
      const reactivateProduct = () =>
        adminApi.unarchiveProduct(String(row.id)).then(reload);
      const archiveProduct = () =>
        adminApi.archiveProduct(String(row.id)).then(reload);

      const rowActions = isArchived ? null : (
        <AdminProductRowActions
          product={{ id: String(row.id), name }}
          status={String(row.status ?? "")}
          listedByPlatform={Boolean(row.listedByPlatform)}
          onPreview={editor.openPreview}
          onEdit={editor.openEdit}
          onManageVariants={editor.openVariants}
          onSubmitOnBehalf={editor.openSubmit}
        />
      );

      if (isArchived) {
        return (
          <AdminConfirmAction
            label={LABELS.reactivateProduct}
            icon={ArchiveRestore}
            dialogVariant="success"
            tone="success"
            title={LABELS.confirmReactivateProductTitle}
            description={formatLabel(LABELS.confirmReactivateProductBody, {
              name: name || LABELS.thisItem,
            })}
            onConfirm={reactivateProduct}
          />
        );
      }

      return (
        <>
          {rowActions}
          <AdminConfirmAction
            label={LABELS.archive}
            dialogVariant="warning"
            tone="archive"
            title={LABELS.confirmArchiveProductTitle}
            description={formatLabel(LABELS.confirmArchiveProductBody, {
              name,
            })}
            onConfirm={archiveProduct}
          />
        </>
      );
    },
    [
      editor.openPreview,
      editor.openEdit,
      editor.openVariants,
      editor.openSubmit,
    ],
  );

  return actions;
}
