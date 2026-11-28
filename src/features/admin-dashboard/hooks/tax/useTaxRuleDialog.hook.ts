"use client";

import { useCallback, useState } from "react";
import type { CategoryOptionData } from "@/features/products";
import type { TaxRuleRow } from "../../api/tax/tax.api";
import type { useTaxCategoryFocus } from "./useTaxCategoryFocus.hook";

/** Which tax rule the dialog is creating or editing, and how it was opened. */
export function useTaxRuleDialog(
  focus: Pick<ReturnType<typeof useTaxCategoryFocus>, "ownRule" | "effective">,
  refresh: () => void,
) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<TaxRuleRow | null>(null);
  const [initialCategory, setInitialCategory] =
    useState<CategoryOptionData | null>(null);

  const openCreate = useCallback(() => {
    setEditing(null);
    setInitialCategory(null);
    setDialogOpen(true);
  }, []);
  const openEdit = useCallback((rule: TaxRuleRow) => {
    setInitialCategory(null);
    setEditing(rule);
    setDialogOpen(true);
  }, []);
  const handleSaved = useCallback(() => {
    setDialogOpen(false);
    refresh();
  }, [refresh]);
  const editFocusedRule = useCallback(() => {
    if (focus.ownRule) openEdit(focus.ownRule);
  }, [focus.ownRule, openEdit]);
  const setFocusedCategoryRate = useCallback(() => {
    if (!focus.effective) return;
    setEditing(null);
    setInitialCategory({
      id: focus.effective.categoryId,
      name: focus.effective.categoryName,
    });
    setDialogOpen(true);
  }, [focus.effective]);

  return {
    dialog: {
      open: dialogOpen,
      rule: editing,
      initialCategory,
      onOpenChange: setDialogOpen,
      onSaved: handleSaved,
    },
    openCreate,
    openEdit,
    editFocusedRule,
    setFocusedCategoryRate,
  };
}
