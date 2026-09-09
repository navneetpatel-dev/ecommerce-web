"use client";

import { useOtpInput } from "../../hooks/otp/useOtpInput.hook";
import { OtpCard } from "../../components/otp/OtpCard.component";
import { AuthPageShell } from "../../components/shell/AuthPageShell.component";

export function OtpPage() {
  const otp = useOtpInput();

  return (
    <AuthPageShell>
      <OtpCard
        digits={otp.digits}
        completed={otp.completed}
        error={otp.error}
        info={otp.info}
        isVerifying={otp.isVerifying}
        timerLabel={otp.timerLabel}
        canResend={otp.canResend}
        needsVerification={otp.needsVerification}
        email={otp.email}
        onSetInputRef={otp.setInputRef}
        onUpdateDigit={otp.updateDigit}
        onKeyDown={otp.handleKeyDown}
        onPaste={otp.handlePaste}
        onVerify={() => void otp.verify()}
        onResend={otp.resend}
      />
    </AuthPageShell>
  );
}
