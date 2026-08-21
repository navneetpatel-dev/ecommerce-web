"use client";

import { LABELS } from "@/shared/constants/labels";
import { useManualFormFieldErrors } from "@/shared/hooks/useManualFormFieldErrors";
import {
  allRequiredFieldsMet,
  firstMissingRequiredHint,
} from "@/shared/utils/firstMissingRequiredHint";
import {
  parseProductListingForm,
  productFormFieldErrors,
  toProductWriteBody,
  type ProductListingFormField,
  type ProductListingFormValues,
  type ProductWriteBody,
} from "@/features/products";

interface UseProductFormControllerOptions {
  values: ProductListingFormValues;
  loading: boolean;
  onChange: (patch: Partial<ProductListingFormValues>) => void;
  onValidSubmit: (body: ProductWriteBody) => void;
}

export function useProductFormController({
  values,
  loading,
  onChange,
  onValidSubmit,
}: UseProductFormControllerOptions) {
  const { clearAll, clearField, setErrors, getError } =
    useManualFormFieldErrors<ProductListingFormField>();

  const requiredChecks = [
    { ok: Boolean(values.name.trim()), message: LABELS.enterProductName },
    {
      ok: values.price !== "" && Number(values.price) >= 1,
      message: LABELS.enterProductPrice,
    },
    { ok: Boolean(values.categoryId), message: LABELS.selectProductCategory },
    {
      ok: Boolean(values.description.trim()),
      message: LABELS.enterProductDescription,
    },
  ];
  const canSubmit = allRequiredFieldsMet(requiredChecks) && !loading;
  const disableHint = loading
    ? LABELS.loading
    : (firstMissingRequiredHint(requiredChecks) ?? "");

  const patchValues = (patch: Partial<ProductListingFormValues>) => {
    for (const key of Object.keys(patch) as ProductListingFormField[]) {
      clearField(key);
    }
    onChange(patch);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    clearAll();
    const parsed = parseProductListingForm(values);
    if (!parsed.success) {
      setErrors(productFormFieldErrors(parsed.error));
      return;
    }
    onValidSubmit(toProductWriteBody(parsed.data));
  };

  return { getError, canSubmit, disableHint, patchValues, handleSubmit };
}
