import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { doorstepConfirmCardStyles } from "./doorstepConfirmCard.styles";

interface DoorstepPasscodeSectionProps {
  otpCode: string;
  requestCodePending: boolean;
  requestCodeSuccess: boolean;
  expiresInMinutes?: number;
  onRequestCode: () => void;
  onOtpInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function DoorstepPasscodeSection({
  otpCode,
  requestCodePending,
  requestCodeSuccess,
  expiresInMinutes,
  onRequestCode,
  onOtpInputChange,
}: DoorstepPasscodeSectionProps) {
  return (
    <div className={doorstepConfirmCardStyles.passcodeBox}>
      <div className={doorstepConfirmCardStyles.passcodeHeader}>
        <label className={doorstepConfirmCardStyles.passcodeLabel}>
          Delivery Passcode
        </label>
        <Button
          variant="outline"
          size="sm"
          loading={requestCodePending}
          onClick={onRequestCode}
        >
          Send new delivery code
        </Button>
      </div>
      {requestCodeSuccess && expiresInMinutes ? (
        <p className={doorstepConfirmCardStyles.passcodeExpiry}>
          Code sent. Expires in {expiresInMinutes} minutes.
        </p>
      ) : null}
      <div className={doorstepConfirmCardStyles.passcodeInputRow}>
        <Input
          inputMode="numeric"
          maxLength={6}
          value={otpCode}
          placeholder="------"
          className={doorstepConfirmCardStyles.passcodeInput}
          onChange={onOtpInputChange}
        />
        <span className={doorstepConfirmCardStyles.passcodeDigits}>
          {otpCode.length}/6 digits
        </span>
      </div>
    </div>
  );
}
