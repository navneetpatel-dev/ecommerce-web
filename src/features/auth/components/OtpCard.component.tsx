import Link from "next/link";
import { AuthFormCard } from "./AuthFormCard.component";
import { Button } from "@/shared/components/ui/button";
import { OtpInput } from "@/shared/components/OtpInput.component";
import { DisabledActionHint } from "@/shared/components/DisabledActionHint.component";
import { ResendVerificationByEmail } from "./ResendVerificationByEmail.component";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths";
import { authFormsStyles } from "./authForms.styles";

interface OtpCardProps {
  digits: string[];
  completed: boolean;
  error: string | null;
  info: string | null;
  isVerifying: boolean;
  timerLabel: string;
  canResend: boolean;
  needsVerification: boolean;
  email: string;
  onSetInputRef: (index: number, node: HTMLInputElement | null) => void;
  onUpdateDigit: (index: number, value: string) => void;
  onKeyDown: (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => void;
  onPaste: (event: React.ClipboardEvent<HTMLInputElement>) => void;
  onVerify: () => void;
  onResend: () => void;
}

export function OtpCard({
  digits,
  completed,
  error,
  info,
  isVerifying,
  timerLabel,
  canResend,
  needsVerification,
  email,
  onSetInputRef,
  onUpdateDigit,
  onKeyDown,
  onPaste,
  onVerify,
  onResend,
}: OtpCardProps) {
  if (needsVerification) {
    return (
      <AuthFormCard
        title={LABELS.verifyOtpTitle}
        description={LABELS.verifyOtpHint}
        footer={
          <Link href={PATHS.login} className={authFormsStyles.footerLink}>
            {LABELS.backToLogin}
          </Link>
        }
      >
        <div className={authFormsStyles.formSpace5}>
          <p className={authFormsStyles.dangerBodySm}>{error}</p>
          <ResendVerificationByEmail email={email} />
        </div>
      </AuthFormCard>
    );
  }

  return (
    <AuthFormCard
      title={LABELS.verifyOtpTitle}
      description={LABELS.verifyOtpHint}
    >
      <div className={authFormsStyles.formSpace5}>
        <OtpInput
          digits={digits}
          onSetInputRef={onSetInputRef}
          onUpdateDigit={onUpdateDigit}
          onKeyDown={onKeyDown}
          onPaste={onPaste}
        />
        <div className={authFormsStyles.otpTimerRow}>
          <span className={authFormsStyles.mutedBodySm}>{timerLabel}</span>
          <DisabledActionHint
            disabled={!canResend}
            message={LABELS.resendCodeWait}
          >
            <Button
              type="button"
              variant="link"
              size="sm"
              className={authFormsStyles.resendLinkButton}
              disabled={!canResend}
              onClick={onResend}
            >
              {LABELS.resendCode}
            </Button>
          </DisabledActionHint>
        </div>
        {info ? <p className={authFormsStyles.mutedBodySm}>{info}</p> : null}
        {error ? <p className={authFormsStyles.dangerBodySm}>{error}</p> : null}
        <DisabledActionHint
          disabled={!completed}
          message={LABELS.enterCompleteOtp}
          className={authFormsStyles.fullWidth}
        >
          <Button
            className={authFormsStyles.fullWidth}
            size="lg"
            disabled={!completed}
            loading={isVerifying}
            onClick={onVerify}
          >
            {LABELS.verifyCode}
          </Button>
        </DisabledActionHint>
      </div>
    </AuthFormCard>
  );
}
