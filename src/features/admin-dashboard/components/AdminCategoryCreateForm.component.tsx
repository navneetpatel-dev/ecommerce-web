"use client";

import type { UseFormReturn } from "react-hook-form";
import {
  CategoryFormSchema,
  type CategoryFormInput,
} from "../schemas/categories.schema";
import { Button } from "@/shared/components/ui/button";
import { DisabledActionHint } from "@/shared/components/DisabledActionHint.component";
import { FormActions } from "@/shared/components/forms";
import { LABELS } from "@/shared/constants/labels";
import { AdminCategoryFormFields } from "./AdminCategoryFormFields.component";

interface AdminCategoryCreateFormProps {
  form: UseFormReturn<CategoryFormInput>;
  isPending: boolean;
  error?: string | null;
}

export function AdminCategoryCreateForm({
  form,
  isPending,
  error = null,
}: AdminCategoryCreateFormProps) {
  const values = form.watch();
  const canSubmit = CategoryFormSchema.safeParse(values).success;

  return (
    <div className="space-y-6">
      <AdminCategoryFormFields form={form} idPrefix="category-create" />
      {error ? <p className="text-body-sm text-danger">{error}</p> : null}
      <FormActions>
        <DisabledActionHint
          disabled={!canSubmit || isPending}
          message={LABELS.enterCategoryName}
        >
          <Button
            type="submit"
            fullWidth="mobile"
            disabled={!canSubmit || isPending}
          >
            {LABELS.createCategory}
          </Button>
        </DisabledActionHint>
      </FormActions>
    </div>
  );
}
