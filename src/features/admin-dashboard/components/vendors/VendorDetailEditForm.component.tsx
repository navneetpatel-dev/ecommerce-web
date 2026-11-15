"use client";

import type { ChangeEvent } from "react";
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
import { LABELS } from "@/shared/constants/labels";
import { adminEntityDetailLabels } from "@/shared/constants/labels/adminEntityDetail";
import { adminPagesStyles } from "../../pages/shared/adminPages.styles";
import { CURRENCY_SYMBOL } from "@/shared/utils/formatting/orderFormat";
import type { VendorEditForm } from "../../hooks/vendors/useAdminVendorDetail.hook";

interface VendorDetailEditFormProps {
  form: VendorEditForm;
  patchForm: (patch: Partial<VendorEditForm>) => void;
  saving: boolean;
  formLeadingMessage?: string | null;
  onSave: () => void;
}

export function VendorDetailEditForm({
  form,
  patchForm,
  saving,
  formLeadingMessage,
  onSave,
}: VendorDetailEditFormProps) {
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

  return (
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
        <FormFieldFrame htmlFor="vendor-cod-enabled">
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
          onClick={onSave}
        >
          {LABELS.save}
        </Button>
      </FormActions>
    </FormStack>
  );
}
