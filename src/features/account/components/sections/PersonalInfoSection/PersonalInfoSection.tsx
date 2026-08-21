"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { LABELS } from "@/shared/constants/labels";
import { useAuthStore } from "@/shared/stores/auth.store";
import { isWorkspaceRole } from "@/shared/utils/roles";
import {
  useAccountProfile,
  useUpdateProfile,
} from "../../../api/account.queries";
import { PersonalInfoForm } from "./PersonalInfoForm";
import type { PersonalForm } from "./PersonalInfoForm";
import { ProfileAside } from "./ProfileAside";

export function PersonalInfoSection() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const isWorkspace = isWorkspaceRole(currentUser?.role);
  const { data: profile, isLoading, isError, error } = useAccountProfile();
  const updateProfile = useUpdateProfile();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<PersonalForm>({
    defaultValues: { name: "", phone: "" },
  });

  const nameValue = watch("name");
  const nameMissing = !nameValue?.trim();
  const canSubmit = !nameMissing && isDirty;
  const disableHint = nameMissing ? LABELS.enterFullName : "";

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name ?? "",
        phone: profile.phone ?? "",
      });
    }
  }, [profile, reset]);

  if (isLoading) {
    return (
      <div className="space-y-4 border border-line bg-surface p-6 shadow-elevation-1">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-full" />
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="border border-line bg-surface px-5 py-10 text-center">
        <p className="text-[0.9375rem] text-ink-muted">
          {(error as Error | null)?.message || LABELS.couldNotLoadProfile}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(18rem,0.8fr)]">
        <PersonalInfoForm
          register={register}
          errors={errors}
          isWorkspace={isWorkspace}
          canSubmit={canSubmit}
          disableHint={disableHint}
          showSaved={updateProfile.isSuccess && !isDirty}
          pending={updateProfile.isPending}
          submitError={updateProfile.error as Error | null}
          onSubmit={handleSubmit(async (data) => {
            await updateProfile.mutateAsync({
              name: data.name.trim(),
              phone: data.phone.trim() || null,
            });
          })}
        />

        <ProfileAside profile={profile} isWorkspace={isWorkspace} />
      </div>
    </div>
  );
}
