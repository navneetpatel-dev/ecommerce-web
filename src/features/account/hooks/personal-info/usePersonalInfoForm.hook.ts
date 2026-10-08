"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LABELS } from "@/shared/constants/labels";
import {
  useAccountProfile,
  useUpdateProfile,
} from "../../api/addresses/account.queries";
import { useApiFormErrors } from "@/shared/hooks/forms/useApiFormErrors.hook";
import { normalisePhoneNumber } from "@/shared/utils/validation/phoneNumber";
import {
  ProfileSchema,
  type ProfileFormInput,
} from "../../schemas/personal-info/profile.schema";
import { useUnsavedChanges } from "@/shared/hooks/forms/useUnsavedChanges.hook";

/**
 * Personal-info form state (Rule 22): schema-driven via zod, submit and
 * dirty tracking owned here, not in the component.
 */
export function usePersonalInfoForm() {
  const {
    data: profile,
    isLoading,
    isError,
    error,
    refetch,
  } = useAccountProfile();
  const updateProfile = useUpdateProfile();

  const form = useForm<ProfileFormInput>({
    mode: "onTouched",
    resolver: zodResolver(ProfileSchema),
    defaultValues: { name: "", phone: "" },
  });

  useUnsavedChanges(form.formState.isDirty);
  const { reset, watch, formState, handleSubmit } = form;

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name ?? "",
        phone: profile.phone ?? "",
      });
    }
  }, [profile, reset]);

  const nameValue = watch("name");
  const canSubmit =
    Boolean(nameValue?.trim()) && formState.isValid && formState.isDirty;
  const disableHint = !formState.isDirty
    ? ""
    : !formState.isValid || !nameValue?.trim()
      ? LABELS.enterFullName
      : "";

  const { formLevelError } = useApiFormErrors(
    form,
    updateProfile.error,
    LABELS.couldNotSaveProfile,
  );

  const onSubmit = handleSubmit(async (data) => {
    await updateProfile.mutateAsync({
      name: data.name.trim(),
      // Stored as digits so "+91 98765 43210" and "09876543210" are one value.
      phone: data.phone?.trim() ? normalisePhoneNumber(data.phone) : null,
    });
  });

  return {
    profile,
    isLoading,
    isError,
    error: error as Error | null,
    refetch,
    form,
    errors: formState.errors,
    canSubmit,
    disableHint,
    showSaved: updateProfile.isSuccess && !formState.isDirty,
    pending: updateProfile.isPending,
    submitError: formLevelError,
    onSubmit,
  };
}
