"use client";

import type { UseFormReturn } from "react-hook-form";
import type { CategoryFormInput } from "../../schemas/categories.schema";
import { FileUpload } from "@/shared/components/FileUpload.component";
import { FormFieldFrame, FormSection } from "@/shared/components/forms";
import { Input } from "@/shared/components/ui/input";
import { LABELS } from "@/shared/constants/labels";
import { UPLOAD_ENTITY, UPLOAD_PURPOSE } from "@/shared/constants/uploads";

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

  return (
    <>
      <FormSection
        title={LABELS.categoryFormSectionImage}
        hint={LABELS.categoryFormSectionImageHint}
        columns={1}
      >
        <FormFieldFrame
          label={LABELS.categoryImageUpload}
          error={imageUrlError}
        >
          <FileUpload
            entityType={UPLOAD_ENTITY.CATEGORIES}
            entityId={uploadEntityId}
            purpose={UPLOAD_PURPOSE.IMAGE}
            accept="image/png,image/jpeg,image/webp"
            valueUrl={imageUrlValue}
            onUploaded={onImageUploaded}
          />
        </FormFieldFrame>
      </FormSection>

      <FormSection
        title={LABELS.categoryFormSectionSeo}
        hint={LABELS.categoryFormSectionSeoHint}
      >
        <FormFieldFrame
          label={LABELS.categorySeoTitle}
          htmlFor={`${idPrefix}-seo-title`}
        >
          <Input id={`${idPrefix}-seo-title`} {...form.register("seoTitle")} />
        </FormFieldFrame>

        <FormFieldFrame
          label={LABELS.categorySeoDescription}
          htmlFor={`${idPrefix}-seo-desc`}
        >
          <Input
            id={`${idPrefix}-seo-desc`}
            {...form.register("seoDescription")}
          />
        </FormFieldFrame>

        <FormFieldFrame
          label={LABELS.categoryCommissionRate}
          htmlFor={`${idPrefix}-commission`}
          hint={LABELS.categoryCommissionRateHint}
          error={commissionRateError}
          className="sm:col-span-2 sm:max-w-md"
        >
          <Input
            id={`${idPrefix}-commission`}
            inputMode="decimal"
            placeholder={LABELS.categoryCommissionPlaceholder}
            error={commissionRateHasError}
            {...form.register("commissionRate")}
          />
        </FormFieldFrame>
      </FormSection>
    </>
  );
}
