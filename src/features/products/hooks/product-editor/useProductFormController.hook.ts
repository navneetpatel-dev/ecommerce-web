"use client";

import { LABELS } from "@/shared/constants/labels";
import { motionSafeScrollBehavior } from "@/shared/utils/a11y/scrollMotion";
import { useManualFormFieldErrors } from "@/shared/hooks/forms/useManualFormFieldErrors.hook";
import {
  allRequiredFieldsMet,
  firstMissingRequiredHint,
} from "@/shared/utils/validation/firstMissingRequiredHint";
import {
  parseProductListingForm,
  productFormFieldErrors,
  toProductWriteBody,
  type ProductListingFormField,
  type ProductListingFormValues,
  type ProductWriteBody,
} from "../../schemas/listing-form/products.schema";
import { useGstPricePreview } from "../../api/listing/products.queries";
import { buildPriceGuide } from "../../utils/product-editor/priceGuide";

interface UseProductFormControllerOptions {
  values: ProductListingFormValues;
  loading: boolean;
  apiFieldErrors?: Partial<Record<ProductListingFormField, string>>;
  onChange: (patch: Partial<ProductListingFormValues>) => void;
  onValidSubmit: (body: ProductWriteBody) => void;
}

/** After a failed submit, bring the first invalid control into view. */
function focusFirstInvalidField() {
  window.requestAnimationFrame(() => {
    const field = document.querySelector<HTMLElement>('[aria-invalid="true"]');
    field?.scrollIntoView({
      block: "center",
      behavior: motionSafeScrollBehavior(),
    });
    field?.focus({ preventScroll: true });
  });
}

export function useProductFormController({
  values,
  loading,
  apiFieldErrors = {},
  onChange,
  onValidSubmit,
}: UseProductFormControllerOptions) {
  const {
    clearAll,
    clearField,
    setErrors,
    getError: getLocalError,
  } = useManualFormFieldErrors<ProductListingFormField>();

  const getError = (field: ProductListingFormField) =>
    apiFieldErrors[field] ?? getLocalError(field);

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
      focusFirstInvalidField();
      return;
    }
    onValidSubmit(toProductWriteBody(parsed.data));
  };

  // What customers will pay for the entered (pre-GST) price, from the server.
  const mrpNumber =
    values.compareAtPrice !== "" && Number(values.compareAtPrice) > 0
      ? Number(values.compareAtPrice)
      : undefined;
  const { data: gstPreview } = useGstPricePreview(
    values.categoryId,
    Number(values.price),
    mrpNumber,
  );
  const priceGuide = buildPriceGuide(values, gstPreview);

  return {
    getError,
    canSubmit,
    disableHint,
    patchValues,
    handleSubmit,
    priceGuide,
  };
}
