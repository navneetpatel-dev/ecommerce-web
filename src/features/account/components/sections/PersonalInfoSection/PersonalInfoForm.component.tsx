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
import { personalInfoSectionStyles as styles } from "./personalInfoSection.styles";

interface PersonalInfoFormProps {
  register: UseFormRegister<PersonalForm>;
  errors: FieldErrors<PersonalForm>;
  isWorkspace: boolean;
  canSubmit: boolean;
  disableHint: string;
  showSaved: boolean;
  pending: boolean;
  submitError: string | null;
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
  const nameHasError = Boolean(errors.name?.message);
  const phoneHasError = Boolean(errors.phone?.message);
  const phoneHint = isWorkspace
    ? LABELS.phoneOptionalContact
    : LABELS.phoneOptionalDelivery;
  const footerLeading = isWorkspace
    ? LABELS.personalInfoFooterWorkspace
    : LABELS.personalInfoFooterCustomer;
  const submitDisabled = !canSubmit;
  const submitButtonDisabled = !canSubmit || pending;

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
              error={nameHasError}
              {...register("name")}
            />
          </FormFieldFrame>

          <FormFieldFrame
            label={LABELS.phone}
            htmlFor="account-phone"
            hint={phoneHint}
            error={errors.phone?.message}
          >
            <Input
              id="account-phone"
              type="tel"
              placeholder={LABELS.phonePlaceholder}
              error={phoneHasError}
              {...register("phone")}
            />
          </FormFieldFrame>

          <div className={styles.formNoticeWrapper}>
            <FormError
              error={submitError}
              fallback={LABELS.couldNotSaveProfile}
            />
            {showSaved && (
              <p className={styles.savedNotice}>{LABELS.personalInfoSaved}</p>
            )}
          </div>
        </FormSection>

        <FormActions leading={footerLeading}>
          <DisabledActionHint disabled={submitDisabled} message={disableHint}>
            <Button
              type="submit"
              loading={pending}
              disabled={submitButtonDisabled}
            >
              {LABELS.saveChanges}
            </Button>
          </DisabledActionHint>
        </FormActions>
      </FormStack>
    </form>
  );
}
