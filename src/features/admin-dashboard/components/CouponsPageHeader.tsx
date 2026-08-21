"use client";

import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/shared/components/ui/button";
import { ButtonGroup } from "@/shared/components/ui/button-group";
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
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { NumberInput } from "@/shared/components/NumberInput";
import { DisabledActionHint } from "@/shared/components/DisabledActionHint";
import { DataTable, type DataTableColumn } from "@/shared/components/DataTable";
import { Plus, Layers } from "lucide-react";
import { CreateCouponForm } from "./CreateCouponForm";
import { adminApi } from "../api/admin.api";
import { adminKeys } from "../api/admin.queries";
import {
  CouponSchema,
  COUPON_FORM_DEFAULTS,
  toCouponCreateBody,
  type CouponFormInput,
} from "../schemas/coupons.schema";
import { LABELS } from "@/shared/constants/labels";
import { formatDateTime } from "@/shared/utils/formatDate";
import type { CouponBatch } from "@/shared/api/types";
import { z } from "zod";

const BulkFormSchema = z.object({
  name: z.string().trim().min(1, LABELS.couponBatchNameRequired),
  count: z
    .number({ message: LABELS.couponBulkCountInvalid })
    .int()
    .min(1, LABELS.couponBulkCountInvalid)
    .max(500, LABELS.couponBulkCountInvalid),
  prefix: z.string().trim().max(8).optional(),
});

type BulkMetaInput = z.infer<typeof BulkFormSchema>;

interface CouponsPageHeaderProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  form: UseFormReturn<CouponFormInput>;
  onSubmit: (data: CouponFormInput) => void;
  isPending: boolean;
}

export function CouponsPageHeader({
  open,
  setOpen,
  form,
  onSubmit,
  isPending,
}: CouponsPageHeaderProps) {
  const queryClient = useQueryClient();
  const [bulkOpen, setBulkOpen] = useState(false);
  const [batchDetail, setBatchDetail] = useState<CouponBatch | null>(null);

  const templateForm = useForm<CouponFormInput>({
    resolver: zodResolver(CouponSchema),
    mode: "onTouched",
    defaultValues: { ...COUPON_FORM_DEFAULTS, code: "BULK" },
  });

  const bulkMetaForm = useForm<BulkMetaInput>({
    resolver: zodResolver(BulkFormSchema),
    defaultValues: { name: "", count: 10, prefix: "CS" },
  });

  const batchesQuery = useQuery({
    queryKey: adminKeys.couponBatches,
    queryFn: () => adminApi.couponBatches(),
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
      setBulkOpen(false);
    },
  });

  const batchColumns: DataTableColumn<CouponBatch>[] = [
    { id: "name", header: LABELS.bulkBatchName, accessor: "name" },
    {
      id: "count",
      header: LABELS.batchGeneratedCount,
      cell: (row) => row.generatedCount,
    },
    {
      id: "redemptions",
      header: LABELS.batchRedemptions,
      cell: (row) => row.redemptionCount ?? 0,
    },
    {
      id: "discount",
      header: LABELS.batchDiscountImpact,
      className: "tabular-nums",
      cell: (row) =>
        `₹${Number(row.discountTotal ?? 0).toLocaleString("en-IN")}`,
    },
    {
      id: "revenue",
      header: LABELS.batchRevenueImpact,
      className: "tabular-nums",
      cell: (row) =>
        `₹${Number(row.revenueImpact ?? 0).toLocaleString("en-IN")}`,
    },
    {
      id: "expires",
      header: LABELS.batchExpires,
      cell: (row) =>
        row.expiresAt ? formatDateTime(row.expiresAt) : LABELS.usageUnlimited,
    },
    {
      id: "created",
      header: LABELS.startDate,
      cell: (row) => formatDateTime(row.createdAt),
    },
  ];

  const bulkMeta = bulkMetaForm.watch();
  const canBulk =
    BulkFormSchema.safeParse(bulkMeta).success &&
    CouponSchema.safeParse(templateForm.watch()).success;

  return (
    <div className="space-y-6">
      <div className="flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-[1.25rem] font-semibold text-ink sm:text-[1.375rem]">
          {LABELS.coupons}
        </h2>
        <ButtonGroup>
          <Dialog open={bulkOpen} onOpenChange={setBulkOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" fullWidth="mobile">
                <Layers aria-hidden /> {LABELS.bulkGenerate}
              </Button>
            </DialogTrigger>
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
                  <FormFieldFrame
                    label={LABELS.bulkPrefix}
                    htmlFor="bulk-prefix"
                  >
                    <Input
                      id="bulk-prefix"
                      {...bulkMetaForm.register("prefix")}
                    />
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

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" fullWidth="mobile">
                <Plus aria-hidden /> {LABELS.createCoupon}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[min(92vh,48rem)] max-w-2xl overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{LABELS.createCoupon}</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={form.handleSubmit(onSubmit, () => {
                  void form.trigger();
                })}
                className="space-y-1"
              >
                <CreateCouponForm form={form} isPending={isPending} />
              </form>
            </DialogContent>
          </Dialog>
        </ButtonGroup>
      </div>

      <section className="space-y-3">
        <h3 className="text-[1rem] font-semibold text-ink">
          {LABELS.couponBatches}
        </h3>
        <DataTable
          columns={batchColumns}
          rows={batchesQuery.data ?? []}
          loading={batchesQuery.isLoading}
          emptyMessage={LABELS.noCouponBatches}
          getRowId={(row) => row.id}
          actions={(row) => (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setBatchDetail(row)}
            >
              {LABELS.viewBatchCodes}
            </Button>
          )}
        />
      </section>

      <Dialog
        open={Boolean(batchDetail)}
        onOpenChange={(next) => !next && setBatchDetail(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {batchDetail?.name ?? LABELS.couponBatches}
            </DialogTitle>
          </DialogHeader>
          {batchDetail ? (
            <div className="space-y-3">
              <dl className="space-y-2 text-[0.875rem]">
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-muted">
                    {LABELS.batchGeneratedCount}
                  </dt>
                  <dd className="tabular-nums font-medium">
                    {batchDetail.generatedCount}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-muted">{LABELS.batchRedemptions}</dt>
                  <dd className="tabular-nums font-medium">
                    {batchDetail.redemptionCount ?? 0}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-muted">
                    {LABELS.batchDiscountImpact}
                  </dt>
                  <dd className="tabular-nums font-medium">
                    ₹
                    {Number(batchDetail.discountTotal ?? 0).toLocaleString(
                      "en-IN",
                    )}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-muted">
                    {LABELS.batchRevenueImpact}
                  </dt>
                  <dd className="tabular-nums font-medium">
                    ₹
                    {Number(batchDetail.revenueImpact ?? 0).toLocaleString(
                      "en-IN",
                    )}
                  </dd>
                </div>
              </dl>
              <ul className="max-h-56 space-y-1 overflow-y-auto rounded-md border border-line p-2 font-mono text-[0.8125rem]">
                {(batchDetail.codes ?? []).map((code) => (
                  <li key={code} className="px-1 py-0.5 text-ink">
                    {code}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
