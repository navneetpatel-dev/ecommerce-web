import { UseFormReturn } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoginFormFields } from "./LoginFormFields.component";
import { AuthFormCard } from "./AuthFormCard.component";
import { FormError } from "@/shared/components/FormError.component";
import { OAuthDivider } from "./OAuthDivider.component";
import { OAuthButton } from "./OAuthButton.component";
import { Button } from "@/shared/components/ui/button";
import { PATHS } from "@/shared/constants/paths";
import { LABELS } from "@/shared/constants/labels";
import { navigate } from "@/shared/utils/navigate";
import type { LoginInput } from "../schemas/auth.schema";

interface LoginCardProps {
  form: UseFormReturn<LoginInput>;
  onSubmit: (data: LoginInput) => void;
  error: string | null;
  isPending: boolean;
  oauthRedirect?: string | null;
}

export function LoginCard({
  form,
  onSubmit,
  error,
  isPending,
  oauthRedirect,
}: LoginCardProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    setFocus,
    setError,
    clearErrors,
    formState: { errors },
  } = form;

  const handleUseEmailCode = async () => {
    clearErrors("password");
    const rawEmail = getValues("email")?.trim() ?? "";
    if (!rawEmail) {
      setError("email", {
        type: "manual",
        message: LABELS.emailRequired,
      });
      setFocus("email");
      return;
    }

    const isValid = await trigger("email");
    if (!isValid) {
      setFocus("email");
      return;
    }

    navigate(router, PATHS.otpForEmail(rawEmail, oauthRedirect));
  };

  return (
    <AuthFormCard
      title={LABELS.welcomeBack}
      description={LABELS.logInToAccount}
      footer={
        <p className="text-center text-body text-ink-muted">
          {LABELS.dontHaveAccount}{" "}
          <Link
            href={PATHS.register}
            className="font-medium text-brand transition-colors hover:text-brand-hover hover:underline"
          >
            {LABELS.register}
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <LoginFormFields
          register={register}
          errors={errors}
          trigger={trigger}
        />
        <FormError error={error} fallback={LABELS.loginFailed} />
        <Button type="submit" className="w-full" size="lg" loading={isPending}>
          {LABELS.logIn}
        </Button>
        <Button
          type="button"
          className="w-full"
          variant="outline"
          size="lg"
          onClick={handleUseEmailCode}
        >
          {LABELS.useEmailCode}
        </Button>
      </form>

      <div className="space-y-3">
        <OAuthDivider />
        <OAuthButton provider="google" redirect={oauthRedirect} />
      </div>
    </AuthFormCard>
  );
}
