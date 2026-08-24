import { AuthFormCard } from "./AuthFormCard.component";
import { Button } from "@/shared/components/ui/button";
import { OtpInput } from "@/shared/components/OtpInput.component";
import { DisabledActionHint } from "@/shared/components/DisabledActionHint.component";
import { LABELS } from "@/shared/constants/labels";

interface OtpCardProps {
  digits: string[];
  completed: boolean;
  error: string | null;
  info: string | null;
  isVerifying: boolean;
  timerLabel: string;
  canResend: boolean;
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
  onSetInputRef,
  onUpdateDigit,
  onKeyDown,
  onPaste,
  onVerify,
  onResend,
}: OtpCardProps) {
  return (
    <AuthFormCard
      title={LABELS.verifyOtpTitle}
      description={LABELS.verifyOtpHint}
    >
      <div className="space-y-5">
        <OtpInput
          digits={digits}
          onSetInputRef={onSetInputRef}
          onUpdateDigit={onUpdateDigit}
          onKeyDown={onKeyDown}
          onPaste={onPaste}
        />
        <div className="flex items-center justify-between gap-3">
          <span className="text-body-sm text-ink-muted">{timerLabel}</span>
          <DisabledActionHint
            disabled={!canResend}
            message={LABELS.resendCodeWait}
          >
            <Button
              type="button"
              variant="link"
              size="sm"
              className="h-auto min-h-0 max-h-none px-0 py-0 text-body-sm font-medium text-brand hover:text-brand-hover"
              disabled={!canResend}
              onClick={onResend}
            >
              {LABELS.resendCode}
            </Button>
          </DisabledActionHint>
        </div>
        {info ? <p className="text-body-sm text-ink-muted">{info}</p> : null}
        {error ? <p className="text-body-sm text-danger">{error}</p> : null}
        <DisabledActionHint
          disabled={!completed}
          message={LABELS.enterCompleteOtp}
          className="w-full"
        >
          <Button
            className="w-full"
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
