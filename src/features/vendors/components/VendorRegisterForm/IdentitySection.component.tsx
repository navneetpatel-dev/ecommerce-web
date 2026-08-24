import type { UseFormReturn } from "react-hook-form";
import { FormFieldFrame, FormSection } from "@/shared/components/forms";
import { Input } from "@/shared/components/ui/input";
import { LABELS } from "@/shared/constants/labels";
import type { VendorRegisterInput } from "../../schemas/vendor.schema";

type VendorRegisterFormInstance = UseFormReturn<VendorRegisterInput>;

interface VendorRegisterIdentitySectionProps {
  register: VendorRegisterFormInstance["register"];
  showNameWarning: boolean;
}

export function VendorRegisterIdentitySection({
  register,
  showNameWarning,
}: VendorRegisterIdentitySectionProps) {
  return (
    <FormSection
      title={LABELS.vendorRegisterSectionIdentity}
      hint={LABELS.vendorRegisterSectionIdentityHint}
    >
      <FormFieldFrame label={LABELS.panHolderName} htmlFor="panHolderName">
        <Input id="panHolderName" {...register("panHolderName")} />
      </FormFieldFrame>
      <FormFieldFrame
        label={LABELS.bankAccountHolderName}
        htmlFor="bankAccountHolderName"
      >
        <Input
          id="bankAccountHolderName"
          {...register("bankAccountHolderName")}
        />
      </FormFieldFrame>
      {showNameWarning ? (
        <p className="rounded-sm bg-warning-subtle px-3 py-2 text-body-sm text-warning sm:col-span-2">
          {LABELS.kycNameMismatchWarning}
        </p>
      ) : null}
    </FormSection>
  );
}
