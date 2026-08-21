"use client";

import type { UseFormReturn } from "react-hook-form";
import {
  CouponSchema,
  couponRequiresValue,
  type CouponFormInput,
} from "../../schemas/coupons.schema";
import { Button } from "@/shared/components/ui/button";
import { FormActions, FormStack } from "@/shared/components/forms";
import { LABELS } from "@/shared/constants/labels";
import { DisabledActionHint } from "@/shared/components/DisabledActionHint";
import {
  type InfiniteMultiSelectPageQuery,
  type InfiniteMultiSelectPageResult,
} from "@/shared/components/InfiniteMultiSelect";
import { adminUsersApi } from "../../api/users.api";
import { useCallback } from "react";
import { CreateCouponBasicsFields } from "./CreateCouponBasicsFields";
import { CreateCouponValueFields } from "./CreateCouponValueFields";
import { CreateCouponScopeFields } from "./CreateCouponScopeFields";
import { CreateCouponConstraintFields } from "./CreateCouponConstraintFields";
import { CreateCouponRestrictionFields } from "./CreateCouponRestrictionFields";

interface CreateCouponFormProps {
  form: UseFormReturn<CouponFormInput>;
  isPending: boolean;
  /** When true, discountBearer is fixed to VENDOR and scope cannot be platform-wide. */
  vendorMode?: boolean;
  /** Required in vendorMode so vendor-scoped coupons keep the locked vendor id. */
  vendorId?: string | null;
  submitLabel?: string;
  /** Hide the submit button (e.g. when parent owns submit). */
  hideSubmit?: boolean;
  /** Hide the coupon code field (bulk template). */
  hideCodeField?: boolean;
}

function couponDisableHint(values: CouponFormInput): string {
  if (!values.code?.trim()) return LABELS.enterCouponCode;
  if (
    couponRequiresValue(values.type) &&
    (values.value == null || Number.isNaN(values.value))
  ) {
    return LABELS.enterCouponValue;
  }
  if (!values.startDate) return LABELS.enterCouponStartDate;
  if (!values.endDate) return LABELS.enterCouponEndDate;
  if (
    values.type === "BUNDLE" &&
    (!values.bundleProductIds || values.bundleProductIds.length === 0)
  ) {
    return LABELS.couponBundleProductsRequired;
  }
  if (
    values.userRestrictionType === "segment" &&
    !values.userRestrictionSegment
  ) {
    return LABELS.couponSegmentRequired;
  }
  if (
    values.userRestrictionType === "specific" &&
    (!values.userRestrictionUserIds ||
      values.userRestrictionUserIds.length === 0)
  ) {
    return LABELS.couponSpecificUsersRequired;
  }
  if (
    values.type !== "BUNDLE" &&
    values.applicableScopeType !== "all" &&
    (!values.applicableScopeIds || values.applicableScopeIds.length === 0)
  ) {
    return LABELS.enterCouponScopeIds;
  }
  const parsed = CouponSchema.safeParse(values);
  if (!parsed.success) {
    return parsed.error.issues[0]?.message ?? LABELS.couponCreateHint;
  }
  return LABELS.couponCreateHint;
}

export function CreateCouponForm({
  form,
  isPending,
  vendorMode = false,
  vendorId = null,
  submitLabel = LABELS.createCoupon,
  hideSubmit = false,
  hideCodeField = false,
}: CreateCouponFormProps) {
  const {
    watch,
    formState: { errors, touchedFields, isSubmitted },
  } = form;

  const values = watch();
  const type = values.type;
  const needsValue = couponRequiresValue(type);
  const canSubmit = CouponSchema.safeParse(values).success;
  const disableHint = couponDisableHint(values);
  const scopeType = values.applicableScopeType;
  const isBundle = type === "BUNDLE";
  const isTiered = type === "TIERED";
  const showScopeIds =
    !isBundle &&
    (scopeType === "product" ||
      scopeType === "category" ||
      (!vendorMode && scopeType === "vendor"));
  const showSegment = values.userRestrictionType === "segment";
  const showSpecificUsers = values.userRestrictionType === "specific";

  const fetchUsersPage = useCallback(
    async (
      query: InfiniteMultiSelectPageQuery,
    ): Promise<InfiniteMultiSelectPageResult> => {
      const result = await adminUsersApi.list({
        page: query.page,
        limit: query.limit,
        search: query.search,
      });
      return {
        items: result.items.map((user) => ({
          id: user.id,
          label: user.name ? `${user.name} (${user.email})` : user.email,
        })),
        page: result.page,
        totalPages: result.totalPages,
        total: result.total,
      };
    },
    [],
  );

  const showError = (name: keyof CouponFormInput) => {
    const touched = Boolean(touchedFields[name as keyof typeof touchedFields]);
    if (!touched && !isSubmitted) return undefined;
    return errors[name]?.message;
  };

  const hasError = (name: keyof CouponFormInput) => Boolean(showError(name));

  return (
    <FormStack>
      <CreateCouponBasicsFields
        form={form}
        showError={showError}
        hasError={hasError}
        vendorMode={vendorMode}
        hideCodeField={hideCodeField}
      />

      <CreateCouponValueFields
        form={form}
        showError={showError}
        hasError={hasError}
        type={type}
        needsValue={needsValue}
        isTiered={isTiered}
      />

      <CreateCouponScopeFields
        form={form}
        showError={showError}
        hasError={hasError}
        vendorMode={vendorMode}
        vendorId={vendorId}
        scopeType={scopeType}
        isBundle={isBundle}
        showScopeIds={showScopeIds}
      />

      <CreateCouponConstraintFields
        form={form}
        showError={showError}
        hasError={hasError}
      />

      <CreateCouponRestrictionFields
        form={form}
        showError={showError}
        hasError={hasError}
        vendorMode={vendorMode}
        showSegment={showSegment}
        showSpecificUsers={showSpecificUsers}
        fetchUsersPage={fetchUsersPage}
      />

      {!hideSubmit ? (
        <FormActions>
          <DisabledActionHint
            disabled={!canSubmit}
            message={disableHint}
            className="w-full"
          >
            <Button
              type="submit"
              className="w-full"
              loading={isPending}
              disabled={!canSubmit || isPending}
            >
              {submitLabel}
            </Button>
          </DisabledActionHint>
        </FormActions>
      ) : null}
    </FormStack>
  );
}
