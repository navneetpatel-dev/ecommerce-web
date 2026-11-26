"use client";

import type { UseFormReturn } from "react-hook-form";
import type { CategoryFormInput } from "../../../schemas/categories/categories.schema";
import { FileUpload } from "@/shared/components/FileUpload";
import { FormFieldFrame, FormSection } from "@/shared/components/forms";
import { Input } from "@/shared/components/ui/input";
import { LABELS } from "@/shared/constants/labels";
import {
  UPLOAD_ENTITY,
  UPLOAD_PURPOSE,
} from "@/shared/constants/uploads/uploads";
import { SeoFieldsSection } from "@/shared/components/forms/seo/SeoFieldsSection.component";

interface AdminCategoryImageSeoFieldsProps {
  form: UseFormReturn<CategoryFormInput>;
  showError: (name: keyof CategoryFormInput) => string | undefined;
  uploadEntityId: string;
  idPrefix: string;
}

export function AdminCategoryImageSeoFields({
  form,
  showError,
  uploadEntityId,
  idPrefix,
}: AdminCategoryImageSeoFieldsProps) {
  const { setValue, watch } = form;
  const watchedImageUrl = watch("imageUrl");
  const trimmedImageUrl = watchedImageUrl?.trim();
  const imageUrlValue = trimmedImageUrl ? trimmedImageUrl : null;
  const imageUrlError = showError("imageUrl");
  const commissionRateError = showError("commissionRate");
  const commissionRateHasError = Boolean(commissionRateError);
  const onImageUploaded = (url: string) =>
    setValue("imageUrl", url, {
      shouldDirty: true,
      shouldValidate: true,
    });

  const setSeoField =
    (name: "seoTitle" | "seoDescription") => (value: string) =>
      setValue(name, value, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
  const seoTitle = {
    value: watch("seoTitle") ?? "",
    error: showError("seoTitle"),
    onChange: setSeoField("seoTitle"),
  };
  const seoDescription = {
    value: watch("seoDescription") ?? "",
    error: showError("seoDescription"),
    onChange: setSeoField("seoDescription"),
  };

  return (
    <>
      <FormSection
        title={LABELS.categoryFormSectionImage}
        hint={LABELS.categoryFormSectionImageHint}
        columns={1}
      >
        <FormFieldFrame error={imageUrlError}>
          <FileUpload
            entityType={UPLOAD_ENTITY.CATEGORIES}
            entityId={uploadEntityId}
            purpose={UPLOAD_PURPOSE.IMAGE}
            accept="image/png,image/jpeg,image/webp"
            valueUrl={imageUrlValue}
            onUploaded={onImageUploaded}
            variant="card"
            removable
            label={LABELS.categoryImageUpload}
          />
        </FormFieldFrame>
      </FormSection>

      <SeoFieldsSection
        seoTitle={seoTitle}
        seoDescription={seoDescription}
        fallbackTitle={watch("name") ?? ""}
        fallbackDescription=""
        idPrefix={`${idPrefix}-seo`}
      />

      <FormSection
        title={LABELS.categoryFormSectionCommission}
        hint={LABELS.categoryFormSectionCommissionHint}
        columns={1}
      >
        <FormFieldFrame
          label={LABELS.categoryCommissionRate}
          htmlFor={`${idPrefix}-commission`}
          hint={LABELS.categoryCommissionRateHint}
          error={commissionRateError}
        >
          <Input
            id={`${idPrefix}-commission`}
            inputMode="decimal"
            normalizeNumeric="decimal"
            placeholder={LABELS.categoryCommissionPlaceholder}
            error={commissionRateHasError}
            {...form.register("commissionRate")}
          />
        </FormFieldFrame>
      </FormSection>
    </>
  );
}
