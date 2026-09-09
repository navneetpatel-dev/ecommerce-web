"use client";

import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { useArchiveCategoryDescription } from "../../../hooks/categories/useArchiveCategoryDescription.hook";

interface ArchiveDescriptionProps {
  categoryId: string;
  name: string;
}

export function ArchiveDescription({
  categoryId,
  name,
}: ArchiveDescriptionProps) {
  const { count } = useArchiveCategoryDescription(categoryId);

  return (
    <>
      {formatLabel(LABELS.confirmArchiveCategoryBody, {
        name,
        count: String(count ?? "…"),
      })}
    </>
  );
}
