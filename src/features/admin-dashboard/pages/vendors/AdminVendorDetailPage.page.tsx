"use client";

import type { ChangeEvent } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { RequirePermission } from "@/shared/components/system/RequirePermission.component";
import { DetailQuerySkeleton } from "@/shared/components/Skeletons/DetailQuerySkeleton.component";
import { QueryErrorAlert } from "@/shared/components/notices/QueryErrorAlert.component";
import { StatusBadge } from "@/shared/components/badges/StatusBadge.component";
import { NumberInput } from "@/shared/components/forms/NumberInput.component";
import { CheckboxField } from "@/shared/components/forms/CheckboxField.component";
import {
  FormActions,
  FormFieldFrame,
  FormSection,
  FormStack,
} from "@/shared/components/forms";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { PERMISSIONS } from "@/shared/constants/permissions/permissions";
import { LABELS } from "@/shared/constants/labels";
import { adminEntityDetailLabels } from "@/shared/constants/labels/adminEntityDetail";
import { useAdminVendorDetail } from "../../hooks/vendors/useAdminVendorDetail.hook";
import { adminPagesStyles } from "../shared/adminPages.styles";
import { CURRENCY_SYMBOL } from "@/shared/utils/formatting/orderFormat";

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
    refetch,
  } = useAdminVendorDetail(vendorId);

  if (isLoading)
    return <DetailQuerySkeleton className={adminPagesStyles.skeletonPy4} />;

  if (isError || !vendor || !form) {
    return (
      <div className={adminPagesStyles.borderBoxEmpty}>
        <QueryErrorAlert
          error={loadError}
          fallback={adminEntityDetailLabels.vendorCouldNotLoadDetail}
          onRetry={refetch}
        />
      </div>
    );
  }

  const statusBadgeElement = vendor.status ? (
    <StatusBadge status={vendor.status} />
  ) : null;
  const formLeadingMessage = message ?? error;

  const handleBusinessNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    patchForm({ businessName: event.target.value });
  };

  const handleCommissionRateChange = (value: number | undefined) => {
    patchForm({ commissionRate: value });
  };

  const handleReturnShippingFeeChange = (value: number | undefined) => {
    patchForm({ returnShippingFee: value });
  };

  const handleCodEnabledChange = (checked: boolean) => {
    patchForm({ codEnabled: checked });
  };

  const handleDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    patchForm({ description: event.target.value });
  };

  const handleSave = () => {
    void save();
  };

  return (
    <div className={adminPagesStyles.pageRoot}>
      <Link href="/admin/vendors" className={adminPagesStyles.backLink}>
        <ArrowLeft size={14} aria-hidden />
        {adminEntityDetailLabels.backToVendors}
      </Link>

      <div className={adminPagesStyles.borderBottomRow}>
        <div className={adminPagesStyles.headerInfo}>
          <h1 className={adminPagesStyles.pageHeadingXl}>
            {vendor.businessName}
          </h1>
          <p className={adminPagesStyles.hint}>{vendor.slug}</p>
        </div>
        {statusBadgeElement}
      </div>

      <FormStack className={adminPagesStyles.formStack}>
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
              onChange={handleBusinessNameChange}
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
              onChange={handleCommissionRateChange}
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
              prefix={CURRENCY_SYMBOL}
              onChange={handleReturnShippingFeeChange}
            />
          </FormFieldFrame>
          <FormFieldFrame label={LABELS.vendorCodEnabled}>
            <CheckboxField
              id="vendor-cod-enabled"
              checked={form.codEnabled}
              onCheckedChange={handleCodEnabledChange}
              label={LABELS.vendorCodEnabled}
            />
          </FormFieldFrame>
          <FormFieldFrame
            label={LABELS.description}
            htmlFor="vendor-description"
            className={adminPagesStyles.colSpan2}
          >
            <Textarea
              id="vendor-description"
              rows={4}
              value={form.description}
              onChange={handleDescriptionChange}
            />
          </FormFieldFrame>
        </FormSection>

        <FormActions leading={formLeadingMessage}>
          <Button
            type="button"
            fullWidth="mobile"
            disabled={saving}
            onClick={handleSave}
          >
            {LABELS.save}
          </Button>
        </FormActions>
      </FormStack>
    </div>
  );
}
