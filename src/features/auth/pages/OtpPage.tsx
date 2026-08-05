'use client'

import { useOtpInput } from '../hooks/useOtpInput'
import { OtpCard } from '../components/OtpCard'

export function OtpPage() {
  const otp = useOtpInput()

  return (
    <div className="min-h-screen bg-paper px-4 py-10 flex items-start justify-center">
      <OtpCard
        digits={otp.digits}
        completed={otp.completed}
        error={otp.error}
        info={otp.info}
        isVerifying={otp.isVerifying}
        timerLabel={otp.timerLabel}
        canResend={otp.canResend}
        onSetInputRef={otp.setInputRef}
        onUpdateDigit={otp.updateDigit}
        onKeyDown={otp.handleKeyDown}
        onPaste={otp.handlePaste}
        onVerify={() => void otp.verify()}
        onResend={otp.resend}
      />
    </div>
  )
}
