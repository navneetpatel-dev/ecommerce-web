"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  FormActions,
  FormFieldFrame,
  FormSection,
  FormStack,
} from "@/shared/components/forms";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { NumberInput } from "@/shared/components/NumberInput";
import { DisabledActionHint } from "@/shared/components/DisabledActionHint";
import { CreateCouponForm } from "../CreateCouponForm";
import { adminApi } from "../../api/admin.api";
import { adminKeys } from "../../api/admin.queries";
import {
  CouponSchema,
  COUPON_FORM_DEFAULTS,
  toCouponCreateBody,
  type CouponFormInput,
} from "../../schemas/coupons.schema";
import { LABELS } from "@/shared/constants/labels";
import { BulkFormSchema, type BulkMetaInput } from "./bulkCouponFormSchema";

interface BulkGenerateDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function BulkGenerateDialog({ open, setOpen }: BulkGenerateDialogProps) {
  const queryClient = useQueryClient();

  const templateForm = useForm<CouponFormInput>({
    resolver: zodResolver(CouponSchema),
    mode: "onTouched",
    defaultValues: { ...COUPON_FORM_DEFAULTS, code: "BULK" },
  });

  const bulkMetaForm = useForm<BulkMetaInput>({
    resolver: zodResolver(BulkFormSchema),
    defaultValues: { name: "", count: 10, prefix: "CS" },
  });

  const bulkMutation = useMutation({
    mutationFn: async () => {
      const metaValid = await bulkMetaForm.trigger();
      const templateValid = await templateForm.trigger();
      if (!metaValid || !templateValid) throw new Error("validation");
      const meta = bulkMetaForm.getValues();
      const template = templateForm.getValues();
      const { code: _code, ...templateFields } = toCouponCreateBody(template);
      return adminApi.bulkGenerateCoupons({
        name: meta.name,
        count: meta.count,
        prefix: meta.prefix || undefined,
        template: templateFields,
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminKeys.coupons.all });
      void queryClient.invalidateQueries({ queryKey: adminKeys.couponBatches });
      bulkMetaForm.reset({ name: "", count: 10, prefix: "CS" });
      templateForm.reset({ ...COUPON_FORM_DEFAULTS, code: "BULK" });
      setOpen(false);
    },
  });

  const canBulk =
    BulkFormSchema.safeParse(bulkMetaForm.watch()).success &&
    CouponSchema.safeParse(templateForm.watch()).success;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[min(92vh,48rem)] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{LABELS.bulkGenerateTitle}</DialogTitle>
        </DialogHeader>
        <FormStack>
          <FormSection
            title={LABELS.bulkCouponMetaSection}
            hint={LABELS.bulkCouponMetaSectionHint}
          >
            <FormFieldFrame
              label={LABELS.bulkBatchName}
              htmlFor="bulk-name"
              className="sm:col-span-2"
            >
              <Input id="bulk-name" {...bulkMetaForm.register("name")} />
            </FormFieldFrame>
            <FormFieldFrame label={LABELS.bulkCount}>
              <Controller
                name="count"
                control={bulkMetaForm.control}
                render={({ field }) => (
                  <NumberInput
                    value={field.value}
                    min={1}
                    max={500}
                    step={1}
                    onChange={(value) => field.onChange(value ?? 1)}
                    onBlur={field.onBlur}
                  />
                )}
              />
            </FormFieldFrame>
            <FormFieldFrame label={LABELS.bulkPrefix} htmlFor="bulk-prefix">
              <Input id="bulk-prefix" {...bulkMetaForm.register("prefix")} />
            </FormFieldFrame>
          </FormSection>
          <CreateCouponForm
            form={templateForm}
            isPending={false}
            hideSubmit
            hideCodeField
          />
          <FormActions>
            <DisabledActionHint
              disabled={!canBulk}
              message={LABELS.bulkGenerateHint}
              className="w-full"
            >
              <Button
                type="button"
                className="w-full"
                loading={bulkMutation.isPending}
                disabled={!canBulk || bulkMutation.isPending}
                onClick={() => bulkMutation.mutate()}
              >
                {LABELS.bulkGenerate}
              </Button>
            </DisabledActionHint>
          </FormActions>
        </FormStack>
      </DialogContent>
    </Dialog>
  );
}
