"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { CheckCircle2, Mail, UserRound } from "lucide-react";
import { FormError } from "@/shared/components/FormError";
import { DisabledActionHint } from "@/shared/components/DisabledActionHint";
import {
  FormActions,
  FormFieldFrame,
  FormSection,
  FormStack,
} from "@/shared/components/forms";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { TextEyebrow } from "@/shared/components/TextEyebrow";
import { Badge } from "@/shared/components/ui/badge";
import { LABELS } from "@/shared/constants/labels";
import { useAuthStore } from "@/shared/stores/auth.store";
import { isWorkspaceRole } from "@/shared/utils/roles";
import { useAccountProfile, useUpdateProfile } from "../../api/account.queries";

interface PersonalForm {
  name: string;
  phone: string;
}

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
        <form
          onSubmit={handleSubmit(async (data) => {
            await updateProfile.mutateAsync({
              name: data.name.trim(),
              phone: data.phone.trim() || null,
            });
          })}
        >
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
                  {...register("name", { required: LABELS.nameRequired })}
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
                  error={updateProfile.error as Error | null}
                  fallback={LABELS.couldNotSaveProfile}
                />
                {updateProfile.isSuccess && !isDirty ? (
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
                  loading={updateProfile.isPending}
                  disabled={!canSubmit || updateProfile.isPending}
                >
                  {LABELS.saveChanges}
                </Button>
              </DisabledActionHint>
            </FormActions>
          </FormStack>
        </form>

        <aside className="border border-line bg-surface shadow-elevation-1">
          <div className="border-b border-line bg-paper/55 px-5 py-4 md:px-6">
            <TextEyebrow>{LABELS.personalInfoProfileEyebrow}</TextEyebrow>
            <p className="mt-1 text-[0.875rem] text-ink-muted">
              {LABELS.personalInfoProfileHint}
            </p>
          </div>

          <div className="space-y-4 px-5 py-5 md:px-6">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-line bg-paper text-ink-muted">
                <UserRound size={18} strokeWidth={1.5} />
              </span>
              <div className="min-w-0">
                <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-ink-faint">
                  {LABELS.personalInfoAccountHolder}
                </p>
                <p className="mt-1 text-[0.9375rem] font-medium text-ink">
                  {profile.name}
                </p>
                {profile.phone ? (
                  <p className="mt-0.5 text-[0.8125rem] text-ink-muted">
                    {profile.phone}
                  </p>
                ) : (
                  <p className="mt-0.5 text-[0.8125rem] text-ink-faint">
                    {LABELS.personalInfoNoPhone}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-line bg-paper text-ink-muted">
                <Mail size={18} strokeWidth={1.5} />
              </span>
              <div className="min-w-0">
                <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-ink-faint">
                  {LABELS.personalInfoEmailStatus}
                </p>
                <p className="mt-1 break-all text-[0.9375rem] font-medium text-ink">
                  {profile.email}
                </p>
                <div className="mt-2">
                  {profile.emailVerified ? (
                    <Badge variant="success" className="gap-1">
                      <CheckCircle2 size={12} />
                      {LABELS.personalInfoVerified}
                    </Badge>
                  ) : (
                    <Badge variant="outline">
                      {LABELS.personalInfoUnverified}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-line pt-4">
              <p className="text-[0.8125rem] leading-6 text-ink-muted">
                {isWorkspace
                  ? LABELS.emailFixedWorkspace
                  : LABELS.emailFixedStorefront}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
