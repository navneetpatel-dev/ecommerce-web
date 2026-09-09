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
import { COUPON_USER_SEGMENT } from "@/shared/constants/statuses";
import type {
  InfiniteMultiSelectPageQuery,
  InfiniteMultiSelectPageResult,
} from "@/shared/components/InfiniteMultiSelect.component";
import { InfiniteMultiSelect } from "@/shared/components/InfiniteMultiSelect.component";
import { USER_RESTRICTIONS } from "../../../constants/coupons/constants";

interface CreateCouponRestrictionFieldsProps {
  form: UseFormReturn<CouponFormInput>;
  showError: (name: keyof CouponFormInput) => string | undefined;
  hasError: (name: keyof CouponFormInput) => boolean;
  vendorMode: boolean;
  showSegment: boolean;
  showSpecificUsers: boolean;
  fetchUsersPage: (
    query: InfiniteMultiSelectPageQuery,
  ) => Promise<InfiniteMultiSelectPageResult>;
}

export function CreateCouponRestrictionFields({
  form,
  showError,
  hasError,
  vendorMode,
  showSegment,
  showSpecificUsers,
  fetchUsersPage,
}: CreateCouponRestrictionFieldsProps) {
  const { control, setValue } = form;

  const availableUserRestrictions = vendorMode
    ? USER_RESTRICTIONS.filter((option) => option.value !== "specific")
    : USER_RESTRICTIONS;

  return (
    <FormSection title={LABELS.couponSectionRestrictions} columns={1}>
      <FormFieldFrame
        label={LABELS.userRestriction}
        error={showError("userRestrictionType")}
      >
        <Controller
          name="userRestrictionType"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value ?? "all"}
              onValueChange={(next) => {
                field.onChange(next);
                if (next !== "segment") {
                  setValue("userRestrictionSegment", null);
                }
                if (next !== "specific") {
                  setValue("userRestrictionUserIds", []);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={LABELS.userRestriction} />
              </SelectTrigger>
              <SelectContent>
                {availableUserRestrictions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </FormFieldFrame>
      {showSegment ? (
        <FormFieldFrame
          label={LABELS.userRestrictionSegment}
          required
          error={showError("userRestrictionSegment")}
        >
          <Controller
            name="userRestrictionSegment"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value ?? undefined}
                onValueChange={field.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder={LABELS.userRestrictionSegment} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={COUPON_USER_SEGMENT.NEW}>
                    {LABELS.userRestrictionSegmentNew}
                  </SelectItem>
                  <SelectItem value={COUPON_USER_SEGMENT.RETURNING}>
                    {LABELS.userRestrictionSegmentReturning}
                  </SelectItem>
                  <SelectItem value={COUPON_USER_SEGMENT.LOYAL}>
                    {LABELS.userRestrictionSegmentLoyal}
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </FormFieldFrame>
      ) : null}
      {showSpecificUsers ? (
        <FormFieldFrame
          label={LABELS.selectSpecificUsers}
          required
          error={showError("userRestrictionUserIds")}
        >
          <Controller
            name="userRestrictionUserIds"
            control={control}
            render={({ field }) => (
              <InfiniteMultiSelect
                value={field.value ?? []}
                onChange={field.onChange}
                fetchPage={fetchUsersPage}
                resetKey="coupon-specific-users"
                searchPlaceholder={LABELS.searchUsers}
                emptyMessage={LABELS.noUsersFound}
                error={hasError("userRestrictionUserIds")}
                idPrefix="coupon-specific-users"
              />
            )}
          />
        </FormFieldFrame>
      ) : null}
    </FormSection>
  );
}
