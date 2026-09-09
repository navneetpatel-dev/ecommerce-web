import { UseFormReturn } from "react-hook-form";
import Link from "next/link";
import { LoginFormFields } from "./LoginFormFields.component";
import { AuthFormCard } from "../shell/AuthFormCard.component";
import { FormError } from "@/shared/components/FormError.component";
import { OAuthDivider } from "../oauth/OAuthDivider.component";
import { OAuthButton } from "../oauth/OAuthButton.component";
import { ResendVerificationByEmail } from "../verify-email/ResendVerificationByEmail.component";
import { Button } from "@/shared/components/ui/button";
import { PATHS } from "@/shared/constants/paths/paths";
import { LABELS } from "@/shared/constants/labels";
import type { LoginInput } from "../../schemas/auth/auth.schema";
import { useLoginCard } from "./LoginCard/useLoginCard.hook";
import {
  AUTH_FOOTER_TEXT,
  AUTH_FORM_ROOT,
  AUTH_LINK,
  AUTH_OAUTH_CONTAINER,
  AUTH_SUBMIT_BUTTON,
} from "./LoginCard/loginCard.styles";

interface LoginCardProps {
  form: UseFormReturn<LoginInput>;
  onSubmit: (data: LoginInput) => void;
  error: string | null;
  isPending: boolean;
  oauthRedirect?: string | null;
  needsVerification?: boolean;
  unverifiedEmail?: string | null;
}

export function LoginCard({
  form,
  onSubmit,
  error,
  isPending,
  oauthRedirect,
  needsVerification,
  unverifiedEmail,
}: LoginCardProps) {
  const { register, trigger } = form;
  const { errors, handleUseEmailCode, onFormSubmit } = useLoginCard({
    form,
    onSubmit,
    oauthRedirect,
  });

  return (
    <AuthFormCard
      title={LABELS.welcomeBack}
      description={LABELS.logInToAccount}
      footer={
        <p className={AUTH_FOOTER_TEXT}>
          {LABELS.dontHaveAccount}{" "}
          <Link href={PATHS.register} className={AUTH_LINK}>
            {LABELS.register}
          </Link>
        </p>
      }
    >
      <form onSubmit={onFormSubmit} className={AUTH_FORM_ROOT}>
        <LoginFormFields
          register={register}
          errors={errors}
          trigger={trigger}
          formError={needsVerification ? null : error}
        />
        {needsVerification && unverifiedEmail && (
          <>
            <FormError error={error} fallback={LABELS.loginFailed} />
            <ResendVerificationByEmail email={unverifiedEmail} />
          </>
        )}
        <Button
          type="submit"
          className={AUTH_SUBMIT_BUTTON}
          size="lg"
          loading={isPending}
        >
          {LABELS.logIn}
        </Button>
        <Button
          type="button"
          className={AUTH_SUBMIT_BUTTON}
          variant="outline"
          size="lg"
          onClick={handleUseEmailCode}
        >
          {LABELS.useEmailCode}
        </Button>
      </form>

      <div className={AUTH_OAUTH_CONTAINER}>
        <OAuthDivider />
        <OAuthButton provider="google" redirect={oauthRedirect} />
      </div>
    </AuthFormCard>
  );
}
