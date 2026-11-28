"use client";

import { useState } from "react";
import type { CategoryOptionData } from "@/features/products";
import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { notifySuccess } from "@/shared/stores/notifications/toast.store";
import { taxApi, type TaxRuleRow } from "../../api/tax/tax.api";
import {
  emptyTaxRuleValues,
  gstPercentOf,
  isNonStandardRate,
  toTaxRuleBody,
  validateTaxRule,
  valuesFromRule,
  type TaxRuleFormErrors,
  type TaxRuleFormValues,
} from "../../utils/tax/taxRuleForm";
import { useTaxScopeTaken } from "./useTaxScopeTaken.hook";

const VALIDATION_MESSAGES = {
  gst: LABELS.enterGstPercentage,
  hsn: LABELS.taxRuleHsnInvalid,
  band: LABELS.gstPriceBandIncomplete,
};

interface Options {
  /** The rule being edited; without it the form creates one. */
  rule?: TaxRuleRow | null;
  /** The category to add the rule for (when opened from a category). */
  initialCategory?: CategoryOptionData | null;
  onSaved: () => void;
}

/** State, validation and saving of the tax rule form (create and edit). */
export function useTaxRuleForm({
  rule = null,
  initialCategory = null,
  onSaved,
}: Options) {
  const [values, setValues] = useState<TaxRuleFormValues>(() =>
    rule
      ? valuesFromRule(rule)
      : { ...emptyTaxRuleValues(), categoryId: initialCategory?.id ?? "" },
  );
  // The category chosen in the picker, kept for its label (the form holds only its id).
  const [category, setCategory] = useState<CategoryOptionData | null>(
    rule?.categoryId
      ? { id: rule.categoryId, name: rule.categoryName ?? "" }
      : initialCategory,
  );
  const [errors, setErrors] = useState<TaxRuleFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const scopeKey = values.categoryId;
  const scopeTaken = useTaxScopeTaken(scopeKey, rule?.id);

  // Why the Save button is disabled (shown as its tooltip), or null when it can be used.
  const blocking = validateTaxRule(values, VALIDATION_MESSAGES);
  const unchanged =
    rule !== null &&
    JSON.stringify(toTaxRuleBody(values)) ===
      JSON.stringify(toTaxRuleBody(valuesFromRule(rule)));
  const saveBlockedReason =
    blocking.gst ??
    blocking.hsn ??
    blocking.band ??
    (scopeTaken
      ? scopeKey
        ? LABELS.taxRuleCategoryTaken
        : LABELS.taxRuleDefaultTaken
      : null) ??
    // The server refused this exact form; saving it again would fail the same way.
    submitError ??
    (unchanged ? LABELS.taxRuleNoChanges : null);

  const patch = (next: Partial<TaxRuleFormValues>) => {
    setValues((current) => ({ ...current, ...next }));
    setErrors({});
    setSubmitError(null);
  };
  const selectCategory = (picked: CategoryOptionData) => {
    setCategory(picked);
    patch({ categoryId: picked.id });
  };
  const clearCategory = () => {
    setCategory(null);
    patch({ categoryId: "" });
  };

  const submit = async () => {
    const found = validateTaxRule(values, VALIDATION_MESSAGES);
    setErrors(found);
    if (Object.keys(found).length) return;
    setSaving(true);
    setSubmitError(null);
    try {
      const body = toTaxRuleBody(values);
      if (rule) await taxApi.updateRule(rule.id, body);
      else await taxApi.createRule(body);
      notifySuccess(LABELS.taxRuleSaved);
      onSaved();
    } catch (err: unknown) {
      setSubmitError(getApiErrorMessage(err, LABELS.couldNotCreateTaxRule));
    } finally {
      setSaving(false);
    }
  };

  return {
    values,
    category,
    errors,
    submitError,
    saving,
    nonStandardRate: isNonStandardRate(values),
    ratePercent: gstPercentOf(values),
    saveBlockedReason,
    patch,
    selectCategory,
    clearCategory,
    submit,
  };
}
