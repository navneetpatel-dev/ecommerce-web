"use client";

import { useCallback } from "react";
import { LABELS } from "@/shared/constants/labels";
import { categoriesApi } from "@/features/categories";
import type { Category } from "@/shared/api/types";
import { AdminConfirmAction } from "../../components/shared/AdminConfirmAction.component";
import { AdminEditCategoryAction } from "../../components/categories/AdminEditCategoryAction.component";
import { AdminCategoryAttributesAction } from "../../components/categories/AdminCategoryAttributesAction.component";
import { AdminArchiveCategoryAction } from "../../components/categories/AdminArchiveCategoryAction.component";
import { ArchiveDescription } from "../../components/categories/AdminArchiveCategoryAction/ArchiveDescription.component";

/** What an admin can do with one category row: edit, attributes, archive and delete. */
export function useCategoryRowActions(reload: () => void) {
  const deleteCategoryFor = useCallback(
    (rowId: string) => () => categoriesApi.delete(rowId).then(reload),
    [reload],
  );
  const renderActions = useCallback(
    (row: Category) => (
      <>
        <AdminEditCategoryAction category={row} onSaved={reload} />
        <AdminCategoryAttributesAction
          categoryId={row.id}
          categoryName={row.name}
        />
        <AdminArchiveCategoryAction category={row} onDone={reload} />
        <AdminConfirmAction
          label={LABELS.delete}
          dialogVariant="danger"
          title={LABELS.confirmDeleteCategoryTitle}
          description={
            <ArchiveDescription
              categoryId={row.id}
              name={row.name}
              mode="delete"
            />
          }
          onConfirm={deleteCategoryFor(row.id)}
        />
      </>
    ),
    [deleteCategoryFor, reload],
  );

  return renderActions;
}
