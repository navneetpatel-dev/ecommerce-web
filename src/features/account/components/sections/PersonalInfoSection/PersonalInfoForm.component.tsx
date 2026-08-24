"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { FormError } from "@/shared/components/FormError.component";
import { DisabledActionHint } from "@/shared/components/DisabledActionHint.component";
import {
  FormActions,
  FormFieldFrame,
  FormSection,
  FormStack,
} from "@/shared/components/forms";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { LABELS } from "@/shared/constants/labels";
import type { ProfileFormInput as PersonalForm } from "../../../schemas/profile.schema";

interface PersonalInfoFormProps {
  register: UseFormRegister<PersonalForm>;
  errors: FieldErrors<PersonalForm>;
  isWorkspace: boolean;
  canSubmit: boolean;
  disableHint: string;
  showSaved: boolean;
  pending: boolean;
  submitError: Error | null;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
}

export function PersonalInfoForm({
  register,
  errors,
  isWorkspace,
  canSubmit,
  disableHint,
  showSaved,
  pending,
  submitError,
  onSubmit,
}: PersonalInfoFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <FormStack>
        <FormSection
          title={LABELS.personalInfoSectionTitle}
          hint={LABELS.personalInfoSectionHint}
        >
          <FormFieldFrame
            label={LABELS.fullName}
            htmlFor="account-name"
            required
            error={errors.name?.message}
          >
            <Input
              id="account-name"
              error={Boolean(errors.name?.message)}
              {...register("name")}
            />
          </FormFieldFrame>

          <FormFieldFrame
            label={LABELS.phone}
            htmlFor="account-phone"
            hint={
              isWorkspace
                ? LABELS.phoneOptionalContact
                : LABELS.phoneOptionalDelivery
            }
            error={errors.phone?.message}
          >
            <Input
              id="account-phone"
              type="tel"
              placeholder={LABELS.phonePlaceholder}
              error={Boolean(errors.phone?.message)}
              {...register("phone")}
            />
          </FormFieldFrame>

          <div className="sm:col-span-2 space-y-3">
            <FormError
              error={submitError}
              fallback={LABELS.couldNotSaveProfile}
            />
            {showSaved ? (
              <p className="text-[0.875rem] text-success">
                {LABELS.personalInfoSaved}
              </p>
            ) : null}
          </div>
        </FormSection>

        <FormActions
          leading={
            isWorkspace
              ? LABELS.personalInfoFooterWorkspace
              : LABELS.personalInfoFooterCustomer
          }
        >
          <DisabledActionHint disabled={!canSubmit} message={disableHint}>
            <Button
              type="submit"
              loading={pending}
              disabled={!canSubmit || pending}
            >
              {LABELS.saveChanges}
            </Button>
          </DisabledActionHint>
        </FormActions>
      </FormStack>
    </form>
  );
}
