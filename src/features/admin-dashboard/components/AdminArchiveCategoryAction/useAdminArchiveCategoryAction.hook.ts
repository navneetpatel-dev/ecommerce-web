"use client";

import { categoriesApi } from "@/features/categories";
import { LABELS } from "@/shared/constants/labels";
import { CATEGORY_STATUS } from "@/shared/constants/statuses";
import { formatLabel } from "@/shared/utils/formatLabel";

interface CategoryInfo {
  id: string;
  name: string;
  status?: string | null;
}

interface UseAdminArchiveCategoryActionParams {
  category: CategoryInfo;
  onDone: () => void;
}

export function useAdminArchiveCategoryAction({
  category,
  onDone,
}: UseAdminArchiveCategoryActionParams) {
  const isArchived = category.status === CATEGORY_STATUS.ARCHIVED;
  const label = isArchived ? LABELS.reactivateCategory : LABELS.archiveCategory;
  const dialogVariant = isArchived
    ? ("success" as const)
    : ("warning" as const);
  const tone = isArchived ? ("success" as const) : ("archive" as const);
  const title = isArchived
    ? LABELS.confirmReactivateCategoryTitle
    : LABELS.confirmArchiveCategoryTitle;

  const nextStatus = isArchived
    ? CATEGORY_STATUS.ACTIVE
    : CATEGORY_STATUS.ARCHIVED;

  const handleConfirm = async () => {
    await categoriesApi.update(category.id, { status: nextStatus });
    onDone();
  };

  const archivedBodyText = isArchived
    ? formatLabel(LABELS.confirmReactivateCategoryBody, {
        name: category.name,
      })
    : null;

  return {
    isArchived,
    label,
    dialogVariant,
    tone,
    title,
    archivedBodyText,
    handleConfirm,
  };
}
