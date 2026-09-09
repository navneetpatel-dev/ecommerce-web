"use client";

import type { UseFormReturn } from "react-hook-form";
import { Controller } from "react-hook-form";
import type { CouponFormInput } from "../../../schemas/coupons/coupons.schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { FormFieldFrame, FormSection } from "@/shared/components/forms";
import { LABELS } from "@/shared/constants/labels";
import { CouponScopeMultiSelect } from "../CouponScopeMultiSelect.component";
import { SCOPE_TYPES, scopePickerLabel } from "../../../constants/coupons/constants";
import { createCouponFormStyles } from "../../../styles/coupons/createCouponForm.styles";

interface CreateCouponScopeFieldsProps {
  form: UseFormReturn<CouponFormInput>;
  showError: (name: keyof CouponFormInput) => string | undefined;
  hasError: (name: keyof CouponFormInput) => boolean;
  vendorMode: boolean;
  vendorId: string | null;
  scopeType: CouponFormInput["applicableScopeType"];
  isBundle: boolean;
  showScopeIds: boolean;
}

export function CreateCouponScopeFields({
  form,
  showError,
  hasError,
  vendorMode,
  vendorId,
  scopeType,
  isBundle,
  showScopeIds,
}: CreateCouponScopeFieldsProps) {
  const { control, setValue } = form;

  const availableScopeTypes = vendorMode
    ? SCOPE_TYPES.filter((option) => option.value !== "all")
    : SCOPE_TYPES;

  return (
    <FormSection title={LABELS.couponSectionScope} columns={1}>
      {vendorMode ? (
        <p className={createCouponFormStyles.hintMuted}>
          {LABELS.couponVendorScopeLocked}
        </p>
      ) : null}
      {isBundle ? (
        <FormFieldFrame
          label={LABELS.selectBundleProducts}
          required
          error={showError("bundleProductIds")}
        >
          <Controller
            name="bundleProductIds"
            control={control}
            render={({ field }) => (
              <CouponScopeMultiSelect
                scopeType="product"
                value={field.value ?? []}
                onChange={field.onChange}
                vendorId={vendorMode ? vendorId : null}
                error={hasError("bundleProductIds")}
              />
            )}
          />
        </FormFieldFrame>
      ) : (
        <>
          <FormFieldFrame
            label={LABELS.applicableScope}
            error={showError("applicableScopeType")}
          >
            <Controller
              name="applicableScopeType"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(next) => {
                    field.onChange(next);
                    if (next === "all") {
                      setValue("applicableScopeIds", [], {
                        shouldValidate: true,
                      });
                      return;
                    }
                    if (vendorMode && next === "vendor" && vendorId) {
                      setValue("applicableScopeIds", [vendorId], {
                        shouldValidate: true,
                      });
                      return;
                    }
                    setValue("applicableScopeIds", [], {
                      shouldValidate: true,
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={LABELS.applicableScope} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableScopeTypes.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FormFieldFrame>
          {showScopeIds ? (
            <FormFieldFrame
              label={scopePickerLabel(scopeType)}
              required
              error={showError("applicableScopeIds")}
            >
              <Controller
                name="applicableScopeIds"
                control={control}
                render={({ field }) => (
                  <CouponScopeMultiSelect
                    scopeType={scopeType as "vendor" | "product" | "category"}
                    value={field.value ?? []}
                    onChange={field.onChange}
                    vendorId={vendorMode ? vendorId : null}
                    error={hasError("applicableScopeIds")}
                  />
                )}
              />
            </FormFieldFrame>
          ) : null}
        </>
      )}
    </FormSection>
  );
}
