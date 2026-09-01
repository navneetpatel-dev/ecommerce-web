import { UseFormReturn } from "react-hook-form";
import Link from "next/link";
import { FormFieldFrame } from "@/shared/components/forms";
import { FormError } from "@/shared/components/FormError.component";
import { AuthFormCard } from "./AuthFormCard.component";
import { Button } from "@/shared/components/ui/button";
import { PasswordInputContainer } from "@/shared/containers/PasswordInputContainer.container";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths";

interface ResetPasswordInput {
  token: string;
  newPassword: string;
}

interface ResetPasswordCardProps {
  form: UseFormReturn<ResetPasswordInput>;
  onSubmit: (data: ResetPasswordInput) => void;
  error: string | null;
  isPending: boolean;
}

export function ResetPasswordCard({
  form,
  onSubmit,
  error,
  isPending,
}: ResetPasswordCardProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <AuthFormCard
      title={LABELS.resetPasswordTitle}
      description={LABELS.resetPasswordHint}
      footer={
        <Link
          href={PATHS.login}
          className="block text-center text-body font-medium text-brand transition-colors hover:text-brand-hover hover:underline"
        >
          {LABELS.backToLogin}
        </Link>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <input type="hidden" {...register("token")} />
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
        <FormError error={error} fallback={LABELS.resetPasswordFailed} />
        <Button type="submit" className="w-full" size="lg" loading={isPending}>
          {LABELS.resetPassword}
        </Button>
      </form>
    </AuthFormCard>
  );
}
