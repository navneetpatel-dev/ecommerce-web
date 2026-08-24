import { UseFormReturn } from "react-hook-form";
import {
  FormFieldFrame,
  FormSection,
  FormStack,
  FormActions,
} from "@/shared/components/forms";
import { FormError } from "@/shared/components/FormError.component";
import { Button } from "@/shared/components/ui/button";
import { PasswordInputContainer } from "@/shared/containers/PasswordInputContainer.container";
import { LABELS } from "@/shared/constants/labels";
import type { ChangePasswordInput } from "../schemas/auth.schema";

interface ChangePasswordSectionProps {
  form: UseFormReturn<ChangePasswordInput>;
  onSubmit: (data: ChangePasswordInput) => void;
  error: Error | null;
  isPending: boolean;
  isSuccess: boolean;
  onChangeAgain?: () => void;
}

export function ChangePasswordSection({
  form,
  onSubmit,
  error,
  isPending,
  isSuccess,
  onChangeAgain,
}: ChangePasswordSectionProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <FormStack>
      <FormSection
        title={LABELS.changePasswordTitle}
        hint={LABELS.changePasswordHint}
        columns={1}
      >
        {isSuccess ? (
          <div className="space-y-3">
            <p className="text-body text-success">
              {LABELS.changePasswordSuccess}
            </p>
            {onChangeAgain ? (
              <Button type="button" variant="outline" onClick={onChangeAgain}>
                {LABELS.changePasswordAgain}
              </Button>
            ) : null}
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 sm:col-span-2"
          >
            <FormFieldFrame
              label={LABELS.currentPassword}
              htmlFor="currentPassword"
              required
              error={errors.currentPassword?.message}
            >
              <PasswordInputContainer
                id="currentPassword"
                autoComplete="current-password"
                error={!!errors.currentPassword}
                {...register("currentPassword")}
              />
            </FormFieldFrame>
            <FormFieldFrame
              label={LABELS.newPassword}
              htmlFor="newPassword"
              required
              error={errors.newPassword?.message}
            >
              <PasswordInputContainer
                id="newPassword"
                autoComplete="new-password"
                error={!!errors.newPassword}
                {...register("newPassword")}
              />
            </FormFieldFrame>
            <FormError error={error} fallback={LABELS.couldNotChangePassword} />
            <FormActions>
              <Button type="submit" loading={isPending}>
                {LABELS.changePassword}
              </Button>
            </FormActions>
          </form>
        )}
      </FormSection>
    </FormStack>
  );
}
