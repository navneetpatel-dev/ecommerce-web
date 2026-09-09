"use client";

import { useEffect, useMemo, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/shared/components/ui/button";
import { DisabledActionHint } from "@/shared/components/DisabledActionHint.component";
import { FormActions, FormStack } from "@/shared/components/forms";
import { FormError } from "@/shared/components/FormError.component";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/shared/components/ui/card";
import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import type { VendorDocumentType } from "@/shared/constants/statuses";
import {
  allRequiredFieldsMet,
  firstMissingRequiredHint,
} from "@/shared/utils/firstMissingRequiredHint";
import { categoriesApi } from "@/features/categories";
import { vendorsApi } from "../../api/vendors.api";
import type { VendorRegisterInput } from "../../schemas/vendor.schema";
import type { Category } from "@/shared/api/types";
import { VendorRegisterBasicsSection } from "./BasicsSection.component";
import { VendorRegisterCategoriesSection } from "./CategoriesSection.component";
import { VendorRegisterIdentitySection } from "./IdentitySection.component";
import { vendorRegisterFormStyles as styles } from "./vendorRegisterForm.styles";

interface VendorRegisterFormProps {
  form: UseFormReturn<VendorRegisterInput>;
  onSubmit: (data: VendorRegisterInput) => void;
  error: string | null;
  isPending: boolean;
}

function namesMismatch(pan?: string, bank?: string) {
  const a = (pan ?? "").trim().toLowerCase().replace(/\s+/g, " ");
  const b = (bank ?? "").trim().toLowerCase().replace(/\s+/g, " ");
  return Boolean(a && b && a !== b);
}

export function VendorRegisterForm({
  form,
  onSubmit,
  error,
  isPending,
}: VendorRegisterFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = form;
  const [auxError, setAuxError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [requiredDocs, setRequiredDocs] = useState<VendorDocumentType[]>([]);
  const entityType = watch("entityType");
  const categoryIds = watch("categoryIds") ?? [];
  const panHolderName = watch("panHolderName");
  const bankAccountHolderName = watch("bankAccountHolderName");
  const showNameWarning = namesMismatch(panHolderName, bankAccountHolderName);

  const businessName = watch("businessName");
  const requiredChecks = [
    { ok: Boolean(businessName?.trim()), message: LABELS.enterBusinessName },
    { ok: Boolean(entityType), message: LABELS.selectVendorEntityType },
    { ok: categoryIds.length > 0, message: LABELS.selectVendorCategories },
  ];
  const canSubmit = allRequiredFieldsMet(requiredChecks);
  const disableHint = firstMissingRequiredHint(requiredChecks) ?? "";

  useEffect(() => {
    void categoriesApi
      .list()
      .then((items) => {
        setCategories(items);
        setAuxError(null);
      })
      .catch((err: unknown) => {
        // Category options are auxiliary; the form stays usable without them.
        setCategories([]);
        setAuxError(getApiErrorMessage(err, LABELS.couldNotLoadData));
      });
  }, []);

  useEffect(() => {
    if (!entityType || categoryIds.length === 0) {
      setRequiredDocs([]);
      return;
    }
    void vendorsApi
      .previewRequiredDocuments(entityType, categoryIds)
      .then((res) => {
        setRequiredDocs(res.requiredDocumentTypes);
        setAuxError(null);
      })
      .catch((err: unknown) => {
        setRequiredDocs([]);
        setAuxError(getApiErrorMessage(err, LABELS.couldNotLoadData));
      });
  }, [entityType, categoryIds]);

  const selectedSet = useMemo(() => new Set(categoryIds), [categoryIds]);

  const toggleCategory = (id: string) => {
    const next = selectedSet.has(id)
      ? categoryIds.filter((value) => value !== id)
      : [...categoryIds, id];
    setValue("categoryIds", next, { shouldValidate: true });
  };

  return (
    <div className={styles.container}>
      <Card>
        <CardHeader>
          <CardTitle className={styles.cardTitle}>
            {LABELS.registerAsVendor}
          </CardTitle>
          <CardDescription>{LABELS.registerAsVendorHint}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormStack>
              {auxError ? (
                <p role="alert" className={styles.auxError}>
                  {auxError}
                </p>
              ) : null}
              <VendorRegisterBasicsSection
                register={register}
                control={control}
                errors={errors}
              />

              <VendorRegisterCategoriesSection
                categories={categories}
                selectedSet={selectedSet}
                onToggleCategory={toggleCategory}
                requiredDocs={requiredDocs}
                errorMessage={
                  errors.categoryIds ? LABELS.vendorCategories : undefined
                }
              />

              <VendorRegisterIdentitySection
                register={register}
                showNameWarning={showNameWarning}
              />

              <FormError error={error} fallback={LABELS.registrationFailed} />

              <FormActions>
                <DisabledActionHint
                  disabled={!canSubmit}
                  message={disableHint}
                  className={styles.submitHint}
                >
                  <Button
                    type="submit"
                    fullWidth="mobile"
                    loading={isPending}
                    disabled={!canSubmit || isPending}
                  >
                    {LABELS.registerAsVendor}
                  </Button>
                </DisabledActionHint>
              </FormActions>
            </FormStack>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
