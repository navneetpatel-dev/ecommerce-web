"use client";

import { useEffect, useState } from "react";
import { AdminConfirmAction } from "./AdminConfirmAction";
import { categoriesApi } from "@/features/categories";
import { LABELS } from "@/shared/constants/labels";
import { CATEGORY_STATUS } from "@/shared/constants/statuses";
import { formatLabel } from "@/shared/utils/formatLabel";

interface AdminArchiveCategoryActionProps {
  category: { id: string; name: string; status?: string | null };
  onDone: () => void;
}

function ArchiveDescription({
  categoryId,
  name,
}: {
  categoryId: string;
  name: string;
}) {
  const [count, setCount] = useState<number | null>(null);
  useEffect(() => {
    void categoriesApi
      .productCount(categoryId)
      .then((result) => setCount(result.productCount));
  }, [categoryId]);
  return (
    <>
      {formatLabel(LABELS.confirmArchiveCategoryBody, {
        name,
        count: String(count ?? "…"),
      })}
    </>
  );
}

export function AdminArchiveCategoryAction({
  category,
  onDone,
}: AdminArchiveCategoryActionProps) {
  const isArchived = category.status === CATEGORY_STATUS.ARCHIVED;

  return (
    <AdminConfirmAction
      label={isArchived ? LABELS.reactivateCategory : LABELS.archiveCategory}
      dialogVariant={isArchived ? "success" : "warning"}
      tone={isArchived ? "success" : "archive"}
      title={
        isArchived
          ? LABELS.confirmReactivateCategoryTitle
          : LABELS.confirmArchiveCategoryTitle
      }
      description={
        isArchived ? (
          formatLabel(LABELS.confirmReactivateCategoryBody, {
            name: category.name,
          })
        ) : (
          <ArchiveDescription categoryId={category.id} name={category.name} />
        )
      }
      onConfirm={() =>
        categoriesApi
          .update(category.id, {
            status: isArchived
              ? CATEGORY_STATUS.ACTIVE
              : CATEGORY_STATUS.ARCHIVED,
          })
          .then(onDone)
      }
    />
  );
}
