"use client";

import { useState } from "react";
import {
  emptyVariantDraft,
  type VariantDraft,
} from "../../utils/product-editor/variantDrafts";

/** The variant rows on screen: the saved ones being edited and the ones not yet added. */
export function useVariantRows() {
  const [rows, setRows] = useState<VariantDraft[]>([]);
  const [newRows, setNewRows] = useState<VariantDraft[]>([]);

  const patchExisting = (key: string, patch: Partial<VariantDraft>) =>
    setRows((current) =>
      current.map((row) => (row.key === key ? { ...row, ...patch } : row)),
    );
  const patchNew = (key: string, patch: Partial<VariantDraft>) =>
    setNewRows((current) =>
      current.map((row) => (row.key === key ? { ...row, ...patch } : row)),
    );
  const discardNew = (key: string) =>
    setNewRows((current) => current.filter((row) => row.key !== key));
  const addNewRow = () =>
    setNewRows((current) => [...current, emptyVariantDraft()]);

  return {
    rows,
    setRows,
    newRows,
    setNewRows,
    patchExisting,
    patchNew,
    discardNew,
    addNewRow,
  };
}
