"use client";

import { AdminConfirmAction } from "../shared/AdminConfirmAction.component";
import { ArchiveDescription } from "./AdminArchiveCategoryAction/ArchiveDescription.component";
import { useAdminArchiveCategoryAction } from "./AdminArchiveCategoryAction/useAdminArchiveCategoryAction.hook";

interface AdminArchiveCategoryActionProps {
  category: { id: string; name: string; status?: string | null };
  onDone: () => void;
}

export function AdminArchiveCategoryAction({
  category,
  onDone,
}: AdminArchiveCategoryActionProps) {
  const {
    isArchived,
    label,
    dialogVariant,
    tone,
    title,
    archivedBodyText,
    handleConfirm,
  } = useAdminArchiveCategoryAction({ category, onDone });

  const description = isArchived ? (
    archivedBodyText
  ) : (
    <ArchiveDescription categoryId={category.id} name={category.name} />
  );

  return (
    <AdminConfirmAction
      label={label}
      dialogVariant={dialogVariant}
      tone={tone}
      title={title}
      description={description}
      onConfirm={handleConfirm}
    />
  );
}
