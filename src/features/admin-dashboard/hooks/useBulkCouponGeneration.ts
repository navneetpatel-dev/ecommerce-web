import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "../api/admin.api";
import { adminKeys } from "../api/admin.queries";
import {
  CouponSchema,
  COUPON_FORM_DEFAULTS,
  toCouponCreateBody,
  type CouponFormInput,
} from "../schemas/coupons.schema";
import {
  BulkFormSchema,
  BULK_FORM_DEFAULTS,
  type BulkMetaInput,
} from "../components/CouponsPageHeader/bulkCouponFormSchema";
import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";

const BULK_TEMPLATE_CODE = "BULK";

/**
 * Owns the bulk coupon generation flow: the template form, the batch-meta
 * form, and the generation mutation (Rules 1/12/16/22). Validation runs via
 * the schema modules; API failures are surfaced through `errorMessage`.
 */
export function useBulkCouponGeneration(onDone: () => void) {
  const queryClient = useQueryClient();

  const templateForm = useForm<CouponFormInput>({
    resolver: zodResolver(CouponSchema),
    mode: "onTouched",
    defaultValues: { ...COUPON_FORM_DEFAULTS, code: BULK_TEMPLATE_CODE },
  });

  const bulkMetaForm = useForm<BulkMetaInput>({
    resolver: zodResolver(BulkFormSchema),
    defaultValues: { ...BULK_FORM_DEFAULTS },
  });

  const resetForms = () => {
    bulkMetaForm.reset({ ...BULK_FORM_DEFAULTS });
    templateForm.reset({ ...COUPON_FORM_DEFAULTS, code: BULK_TEMPLATE_CODE });
  };

  const bulkMutation = useMutation({
    mutationFn: (input: { meta: BulkMetaInput; template: CouponFormInput }) => {
      const { code: _code, ...templateFields } = toCouponCreateBody(
        input.template,
      );
      return adminApi.bulkGenerateCoupons({
        name: input.meta.name,
        count: input.meta.count,
        prefix: input.meta.prefix || undefined,
        template: templateFields,
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminKeys.coupons.all });
      void queryClient.invalidateQueries({ queryKey: adminKeys.couponBatches });
      resetForms();
      onDone();
    },
  });

  const canBulk =
    BulkFormSchema.safeParse(bulkMetaForm.watch()).success &&
    CouponSchema.safeParse(templateForm.watch()).success;

  const submit = () => {
    if (!canBulk) {
      void bulkMetaForm.trigger();
      void templateForm.trigger();
      return;
    }
    bulkMutation.mutate({
      meta: bulkMetaForm.getValues(),
      template: templateForm.getValues(),
    });
  };

  const closeAndReset = () => {
    bulkMutation.reset();
    resetForms();
  };

  return {
    templateForm,
    bulkMetaForm,
    canBulk,
    isPending: bulkMutation.isPending,
    errorMessage: bulkMutation.isError
      ? getApiErrorMessage(bulkMutation.error, LABELS.genericActionFailed)
      : null,
    submit,
    closeAndReset,
  };
}
