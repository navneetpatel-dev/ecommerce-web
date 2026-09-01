import { UseFormReturn } from "react-hook-form";
import Link from "next/link";
import { FormFieldFrame } from "@/shared/components/forms";
import { FormError } from "@/shared/components/FormError.component";
import { AuthFormCard } from "./AuthFormCard.component";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths";

interface ForgotPasswordInput {
  email: string;
}

interface ForgotPasswordCardProps {
  form: UseFormReturn<ForgotPasswordInput>;
  onSubmit: (data: ForgotPasswordInput) => void;
  isPending: boolean;
  isSuccess: boolean;
  formLevelError?: string | null;
}

export function ForgotPasswordCard({
  form,
  onSubmit,
  isPending,
  isSuccess,
  formLevelError = null,
}: ForgotPasswordCardProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <AuthFormCard
      title={LABELS.forgotPasswordTitle}
      description={LABELS.forgotPasswordHint}
      footer={
        <Link
          href={PATHS.login}
          className="block text-center text-body font-medium text-brand transition-colors hover:text-brand-hover hover:underline"
        >
          {LABELS.backToLogin}
        </Link>
      }
    >
      {isSuccess ? (
        <p className="rounded-md border border-success/25 bg-success-subtle/60 px-4 py-3 text-body text-success">
          {LABELS.resetLinkSent}
        </p>
      ) : (
        <form
          onSubmit={handleSubmit((data) => onSubmit(data))}
          className="space-y-5"
        >
          <FormFieldFrame
            label={LABELS.email}
            htmlFor="email"
            required
            error={errors.email?.message}
          >
            <Input
              id="email"
              type="email"
              autoComplete="email"
              error={Boolean(errors.email)}
              {...register("email")}
            />
          </FormFieldFrame>
          <FormError
            error={formLevelError}
            fallback={LABELS.resetPasswordFailed}
          />
          <Button
            type="submit"
            className="w-full"
            size="lg"
            loading={isPending}
          >
            {LABELS.sendResetLink}
          </Button>
        </form>
      )}
    </AuthFormCard>
  );
}
