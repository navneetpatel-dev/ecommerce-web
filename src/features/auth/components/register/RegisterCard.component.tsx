import { UseFormReturn } from "react-hook-form";
import Link from "next/link";
import { FormFieldFrame } from "@/shared/components/forms";
import { FormError } from "@/shared/components/forms/FormError.component";
import { AuthFormCard } from "../shell/AuthFormCard.component";
import { OAuthDivider } from "../oauth/OAuthDivider.component";
import { OAuthButton } from "../oauth/OAuthButton.component";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { PasswordInputContainer } from "@/shared/containers/forms/PasswordInputContainer.container";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths/paths";
import type { RegisterInput } from "../../schemas/auth/auth.schema";
import { RegisterTermsField } from "./RegisterTermsField.component";
import { authFormsStyles } from "../../styles/shell/authForms.styles";

interface RegisterCardProps {
  form: UseFormReturn<RegisterInput>;
  onSubmit: (data: RegisterInput) => void;
  error: string | null;
  isPending: boolean;
  isSuccess: boolean;
  registeredEmail: string | null;
}

export function RegisterCard({
  form,
  onSubmit,
  error,
  isPending,
  isSuccess,
  registeredEmail,
}: RegisterCardProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const acceptTerms = watch("acceptTerms");
  const handleAcceptedChange = (accepted: boolean) => {
    setValue("acceptTerms", accepted, {
      shouldValidate: true,
      shouldTouch: true,
    });
  };

  if (isSuccess) {
    return (
      <AuthFormCard
        title={LABELS.registrationSuccessTitle}
        description={LABELS.registrationSuccessNextSteps}
        footer={
          <Link href={PATHS.login} className={authFormsStyles.footerLink}>
            {LABELS.backToLogin}
          </Link>
        }
      >
        <div className={authFormsStyles.successBanner}>
          <p>{LABELS.registrationSuccessHint}</p>
          {registeredEmail && (
            <p className={authFormsStyles.registeredEmailText}>
              {registeredEmail}
            </p>
          )}
        </div>
      </AuthFormCard>
    );
  }

  return (
    <AuthFormCard
      title={LABELS.createAccount}
      description={LABELS.createAccountHint}
      footer={
        <p className={authFormsStyles.footerText}>
          {LABELS.alreadyHaveAccount}{" "}
          <Link href={PATHS.login} className={authFormsStyles.footerLinkInline}>
            {LABELS.logIn}
          </Link>
        </p>
      }
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={authFormsStyles.formSpace4}
      >
        <FormFieldFrame
          label={LABELS.name}
          htmlFor="name"
          required
          error={errors.name?.message}
        >
          <Input
            id="name"
            autoComplete="name"
            error={Boolean(errors.name)}
            {...register("name")}
          />
        </FormFieldFrame>
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
        <FormFieldFrame
          label={LABELS.phoneOptional}
          htmlFor="phone"
          error={errors.phone?.message}
        >
          <Input
            id="phone"
            type="tel"
            autoComplete="tel"
            error={Boolean(errors.phone)}
            {...register("phone")}
          />
        </FormFieldFrame>
        <FormFieldFrame
          label={LABELS.password}
          htmlFor="password"
          required
          error={errors.password?.message}
          hint={LABELS.passwordMinLength}
        >
          <PasswordInputContainer
            id="password"
            autoComplete="new-password"
            error={!!errors.password}
            {...register("password")}
          />
        </FormFieldFrame>
        <FormError error={error} fallback={LABELS.registrationFailed} />
        <RegisterTermsField
          accepted={acceptTerms}
          error={errors.acceptTerms?.message}
          onAcceptedChange={handleAcceptedChange}
        />
        <Button
          type="submit"
          className={authFormsStyles.fullWidth}
          size="lg"
          loading={isPending}
        >
          {LABELS.register}
        </Button>
      </form>

      <div className={authFormsStyles.oauthGroup}>
        <OAuthDivider />
        <OAuthButton provider="google" />
      </div>
    </AuthFormCard>
  );
}
