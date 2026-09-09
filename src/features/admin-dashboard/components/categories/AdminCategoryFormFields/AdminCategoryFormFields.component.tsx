"use client";

import { useMemo } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { CategoryFormInput } from "../../../schemas/categories/categories.schema";
import { FormStack } from "@/shared/components/forms";
import { AdminCategoryBasicsFields } from "./AdminCategoryBasicsFields.component";
import { AdminCategoryImageSeoFields } from "./AdminCategoryImageSeoFields.component";
import { AdminCategoryPolicyFields } from "./AdminCategoryPolicyFields.component";
import { useCategoryParentOptions } from "./useCategoryParentOptions.hook";

interface AdminCategoryFormFieldsProps {
  form: UseFormReturn<CategoryFormInput>;
  /** Exclude this category from parent options (edit self). */
  excludeCategoryId?: string;
  idPrefix?: string;
}

export function AdminCategoryFormFields({
  form,
  excludeCategoryId,
  idPrefix = "category",
}: AdminCategoryFormFieldsProps) {
  const {
    formState: { errors, touchedFields, isSubmitted },
  } = form;

  const parentOptions = useCategoryParentOptions(excludeCategoryId);
  const draftUploadId = useMemo(() => crypto.randomUUID(), []);
  const uploadEntityId = excludeCategoryId ?? draftUploadId;

  const showError = (name: keyof CategoryFormInput) => {
    const touched = Boolean(touchedFields[name as keyof typeof touchedFields]);
    if (!touched && !isSubmitted) return undefined;
    return errors[name]?.message;
  };

  return (
    <FormStack>
      <AdminCategoryBasicsFields
        form={form}
        showError={showError}
        parentOptions={parentOptions}
        idPrefix={idPrefix}
      />

      <AdminCategoryImageSeoFields
        form={form}
        showError={showError}
        uploadEntityId={uploadEntityId}
        idPrefix={idPrefix}
      />

      <AdminCategoryPolicyFields
        form={form}
        showError={showError}
        idPrefix={idPrefix}
      />
    </FormStack>
  );
}
