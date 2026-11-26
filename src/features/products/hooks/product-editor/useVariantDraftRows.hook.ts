"use client";

import { useCallback } from "react";
import {
  emptyVariantDraft,
  type VariantDraft,
} from "../../utils/product-editor/variantDrafts";

/** Add, change and remove rows of a list of variant drafts held by the parent form. */
export function useVariantDraftRows(
  rows: VariantDraft[],
  onChange: (rows: VariantDraft[]) => void,
) {
  const addRow = useCallback(
    () => onChange([...rows, emptyVariantDraft()]),
    [rows, onChange],
  );
  const patchRow = useCallback(
    (key: string, patch: Partial<VariantDraft>) =>
      onChange(
        rows.map((row) => (row.key === key ? { ...row, ...patch } : row)),
      ),
    [rows, onChange],
  );
  const removeRow = useCallback(
    (key: string) => onChange(rows.filter((row) => row.key !== key)),
    [rows, onChange],
  );
  return { addRow, patchRow, removeRow };
}
