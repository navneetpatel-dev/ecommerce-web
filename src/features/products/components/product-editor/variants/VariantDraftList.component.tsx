"use client";

import type {
  VariantDraft,
  VariantDraftErrors,
} from "../../../utils/product-editor/variantDrafts";
import { VariantDraftRow } from "./VariantDraftRow.component";

interface VariantDraftListProps {
  rows: VariantDraft[];
  errors: Record<string, VariantDraftErrors>;
  disabled: boolean;
  onPatch: (key: string, patch: Partial<VariantDraft>) => void;
  onRemove: (key: string) => void;
}

export function VariantDraftList({
  rows,
  errors,
  disabled,
  onPatch,
  onRemove,
}: VariantDraftListProps) {
  return (
    <>
      {rows.map((row, index) => (
        <VariantDraftRow
          key={row.key}
          index={index}
          draft={row}
          errors={errors[row.key]}
          disabled={disabled}
          onPatch={onPatch}
          onRemove={onRemove}
        />
      ))}
    </>
  );
}
