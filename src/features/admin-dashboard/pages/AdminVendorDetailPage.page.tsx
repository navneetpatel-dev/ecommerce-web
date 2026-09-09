"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { RequirePermission } from "@/shared/components/RequirePermission.component";
import { DetailQuerySkeleton } from "@/shared/components/DetailQuerySkeleton.component";
import { QueryErrorAlert } from "@/shared/components/QueryErrorAlert.component";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { NumberInput } from "@/shared/components/NumberInput.component";
import { CheckboxField } from "@/shared/components/CheckboxField.component";
import {
  FormActions,
  FormFieldFrame,
  FormSection,
  FormStack,
} from "@/shared/components/forms";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { LABELS } from "@/shared/constants/labels";
import { adminEntityDetailLabels } from "@/shared/constants/labels/adminEntityDetail";
import { useAdminVendorDetail } from "../hooks/useAdminVendorDetail.hook";

export function AdminVendorDetailPage() {
  return (
    <RequirePermission permission={PERMISSIONS.VENDOR_MANAGE}>
      <AdminVendorDetailContent />
    </RequirePermission>
  );
}

function AdminVendorDetailContent() {
  const params = useParams<{ id: string }>();
  const vendorId = params.id;
  const {
    vendor,
    isLoading,
    isError,
    loadError,
    form,
    patchForm,
    save,
    saving,
    message,
    error,
  } = useAdminVendorDetail(vendorId);

  if (isLoading) return <DetailQuerySkeleton className="space-y-3 py-4" />;

  if (isError || !vendor || !form) {
    return (
      <div className="border border-line bg-surface-raised px-5 py-10 text-center">
        <QueryErrorAlert
          error={loadError}
          fallback={adminEntityDetailLabels.vendorCouldNotLoadDetail}
        />
      </div>
    );
  }

  const statusBadgeElement = vendor.status ? (
    <StatusBadge status={vendor.status} />
  ) : null;
  const formLeadingMessage = message ?? error;

  return (
    <div className="w-full min-w-0 space-y-5">
      <Link
        href="/admin/vendors"
        className="inline-flex items-center gap-1.5 text-body-sm font-medium text-ink-muted hover:text-ink"
      >
        <ArrowLeft size={14} aria-hidden />
        {adminEntityDetailLabels.backToVendors}
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
        <div className="min-w-0 space-y-1">
          <h1 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
            {vendor.businessName}
          </h1>
          <p className="text-body-sm text-ink-muted">{vendor.slug}</p>
        </div>
        {statusBadgeElement}
      </div>

      <FormStack className="space-y-8">
        <FormSection
          title={adminEntityDetailLabels.vendorEditSection}
          hint={adminEntityDetailLabels.vendorEditSectionHint}
          columns={2}
        >
          <FormFieldFrame
            label={LABELS.businessName}
            htmlFor="vendor-business-name"
          >
            <Input
              id="vendor-business-name"
              value={form.businessName}
              onChange={(e) => patchForm({ businessName: e.target.value })}
            />
          </FormFieldFrame>
          <FormFieldFrame
            label={LABELS.commissionRate}
            htmlFor="vendor-commission-rate"
            hint={adminEntityDetailLabels.vendorCommissionRateHint}
          >
            <NumberInput
              id="vendor-commission-rate"
              value={form.commissionRate}
              min={0}
              max={100}
              step={1}
              suffix="%"
              onChange={(value) => patchForm({ commissionRate: value })}
            />
          </FormFieldFrame>
          <FormFieldFrame
            label={LABELS.returnShippingFee}
            htmlFor="vendor-return-shipping-fee"
            hint={LABELS.returnShippingFeeHint}
          >
            <NumberInput
              id="vendor-return-shipping-fee"
              value={form.returnShippingFee}
              min={0}
              step={10}
              prefix="₹"
              onChange={(value) => patchForm({ returnShippingFee: value })}
            />
          </FormFieldFrame>
          <FormFieldFrame label={LABELS.vendorCodEnabled}>
            <CheckboxField
              id="vendor-cod-enabled"
              checked={form.codEnabled}
              onCheckedChange={(checked) => patchForm({ codEnabled: checked })}
              label={LABELS.vendorCodEnabled}
            />
          </FormFieldFrame>
          <FormFieldFrame
            label={LABELS.description}
            htmlFor="vendor-description"
            className="sm:col-span-2"
          >
            <Textarea
              id="vendor-description"
              rows={4}
              value={form.description}
              onChange={(e) => patchForm({ description: e.target.value })}
            />
          </FormFieldFrame>
        </FormSection>

        <FormActions leading={formLeadingMessage}>
          <Button
            type="button"
            fullWidth="mobile"
            disabled={saving}
            onClick={() => void save()}
          >
            {LABELS.save}
          </Button>
        </FormActions>
      </FormStack>
    </div>
  );
}
