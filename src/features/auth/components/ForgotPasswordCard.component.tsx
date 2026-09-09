import { UseFormReturn } from "react-hook-form";
import Link from "next/link";
import { FormFieldFrame } from "@/shared/components/forms";
import { FormError } from "@/shared/components/FormError.component";
import { AuthFormCard } from "./AuthFormCard.component";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths";
import { authFormsStyles } from "./authForms.styles";

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
        <Link href={PATHS.login} className={authFormsStyles.footerLink}>
          {LABELS.backToLogin}
        </Link>
      }
    >
      {isSuccess ? (
        <p className={authFormsStyles.successBanner}>{LABELS.resetLinkSent}</p>
      ) : (
        <form
          onSubmit={handleSubmit((data) => onSubmit(data))}
          className={authFormsStyles.formSpace5}
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
            className={authFormsStyles.fullWidth}
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
