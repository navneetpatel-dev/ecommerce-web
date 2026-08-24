import { Controller, type UseFormReturn } from "react-hook-form";
import { FormFieldFrame, FormSection } from "@/shared/components/forms";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { LABELS } from "@/shared/constants/labels";
import {
  VENDOR_ENTITY_TYPE_VALUES,
  type VendorEntityType,
} from "@/shared/constants/statuses";
import { vendorEntityTypeLabel } from "@/shared/utils/vendorEntityTypeLabel";
import { cn } from "@/shared/utils/cn";
import type { VendorRegisterInput } from "../../schemas/vendor.schema";

type VendorRegisterFormInstance = UseFormReturn<VendorRegisterInput>;

interface VendorRegisterBasicsSectionProps {
  register: VendorRegisterFormInstance["register"];
  control: VendorRegisterFormInstance["control"];
  errors: VendorRegisterFormInstance["formState"]["errors"];
}

export function VendorRegisterBasicsSection({
  register,
  control,
  errors,
}: VendorRegisterBasicsSectionProps) {
  return (
    <FormSection
      title={LABELS.vendorRegisterSectionBasics}
      hint={LABELS.vendorRegisterSectionBasicsHint}
    >
      <FormFieldFrame
        label={LABELS.businessName}
        htmlFor="businessName"
        required
        error={errors.businessName?.message}
        className="sm:col-span-2"
      >
        <Input
          id="businessName"
          error={Boolean(errors.businessName?.message)}
          {...register("businessName")}
        />
      </FormFieldFrame>

      <FormFieldFrame
        label={LABELS.entityType}
        required
        error={errors.entityType?.message}
      >
        <Controller
          control={control}
          name="entityType"
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={(value) =>
                field.onChange(value as VendorEntityType)
              }
            >
              <SelectTrigger
                className={cn(
                  Boolean(errors.entityType?.message) && "border-danger",
                )}
              >
                <SelectValue placeholder={LABELS.entityType} />
              </SelectTrigger>
              <SelectContent>
                {VENDOR_ENTITY_TYPE_VALUES.map((value) => (
                  <SelectItem key={value} value={value}>
                    {vendorEntityTypeLabel(value)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </FormFieldFrame>

      <FormFieldFrame
        label={LABELS.businessDescriptionOptional}
        htmlFor="description"
      >
        <Textarea id="description" {...register("description")} />
      </FormFieldFrame>

      <FormFieldFrame label={LABELS.gstNumberOptional} htmlFor="gstNumber">
        <Input id="gstNumber" {...register("gstNumber")} />
      </FormFieldFrame>
    </FormSection>
  );
}
