"use client";

import type { UseFormReturn } from "react-hook-form";
import type { CategoryFormInput } from "../../schemas/categories.schema";
import { FileUpload } from "@/shared/components/FileUpload";
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

  return (
    <>
      <FormSection
        title={LABELS.categoryFormSectionImage}
        hint={LABELS.categoryFormSectionImageHint}
        columns={1}
      >
        <FormFieldFrame
          label={LABELS.categoryImageUpload}
          error={showError("imageUrl")}
        >
          <FileUpload
            entityType={UPLOAD_ENTITY.CATEGORIES}
            entityId={uploadEntityId}
            purpose={UPLOAD_PURPOSE.IMAGE}
            accept="image/png,image/jpeg,image/webp"
            valueUrl={watchedImageUrl?.trim() ? watchedImageUrl.trim() : null}
            onUploaded={(url) =>
              setValue("imageUrl", url, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
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
          error={showError("commissionRate")}
          className="sm:col-span-2 sm:max-w-md"
        >
          <Input
            id={`${idPrefix}-commission`}
            inputMode="decimal"
            placeholder={LABELS.categoryCommissionPlaceholder}
            error={Boolean(showError("commissionRate"))}
            {...form.register("commissionRate")}
          />
        </FormFieldFrame>
      </FormSection>
    </>
  );
}
