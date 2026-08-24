"use client";

import { Skeleton } from "@/shared/components/ui/skeleton";
import { LABELS } from "@/shared/constants/labels";
import { useAuthStore } from "@/shared/stores/auth.store";
import { isWorkspaceRole } from "@/shared/utils/roles";
import { usePersonalInfoForm } from "../../../hooks/usePersonalInfoForm.hook";
import { PersonalInfoForm } from "./PersonalInfoForm.component";
import { ProfileAside } from "./ProfileAside.component";

/** Personal-info section: renders the form hook's prepared state (Rule 1). */
export function PersonalInfoSection() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const isWorkspace = isWorkspaceRole(currentUser?.role);
  const {
    profile,
    isLoading,
    isError,
    error,
    form,
    errors,
    canSubmit,
    disableHint,
    showSaved,
    pending,
    submitError,
    onSubmit,
  } = usePersonalInfoForm();

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
        <p className="text-body text-ink-muted">
          {(error as Error | null)?.message || LABELS.couldNotLoadProfile}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(18rem,0.8fr)]">
        <PersonalInfoForm
          register={form.register}
          errors={errors}
          isWorkspace={isWorkspace}
          canSubmit={canSubmit}
          disableHint={disableHint}
          showSaved={showSaved}
          pending={pending}
          submitError={submitError}
          onSubmit={onSubmit}
        />

        <ProfileAside profile={profile} isWorkspace={isWorkspace} />
      </div>
    </div>
  );
}
