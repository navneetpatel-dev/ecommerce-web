"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LABELS } from "@/shared/constants/labels";
import { useAccountProfile, useUpdateProfile } from "../api/account.queries";
import {
  ProfileSchema,
  type ProfileFormInput,
} from "../schemas/profile.schema";

/**
 * Personal-info form state (Rule 22): schema-driven via zod, submit and
 * dirty tracking owned here, not in the component.
 */
export function usePersonalInfoForm() {
  const { data: profile, isLoading, isError, error } = useAccountProfile();
  const updateProfile = useUpdateProfile();

  const form = useForm<ProfileFormInput>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: { name: "", phone: "" },
  });
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

  const onSubmit = handleSubmit(async (data) => {
    await updateProfile.mutateAsync({
      name: data.name.trim(),
      phone: data.phone?.trim() || null,
    });
  });

  return {
    profile,
    isLoading,
    isError,
    error: error as Error | null,
    form,
    errors: formState.errors,
    canSubmit,
    disableHint,
    showSaved: updateProfile.isSuccess && !formState.isDirty,
    pending: updateProfile.isPending,
    submitError: updateProfile.error as Error | null,
    onSubmit,
  };
}
