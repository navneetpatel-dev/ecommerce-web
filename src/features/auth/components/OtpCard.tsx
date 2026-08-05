import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { OtpInput } from '@/shared/components/OtpInput'

interface OtpCardProps {
  digits: string[]
  completed: boolean
  error: string | null
  info: string | null
  isVerifying: boolean
  timerLabel: string
  canResend: boolean
  onSetInputRef: (index: number, node: HTMLInputElement | null) => void
  onUpdateDigit: (index: number, value: string) => void
  onKeyDown: (index: number, event: React.KeyboardEvent<HTMLInputElement>) => void
  onPaste: (event: React.ClipboardEvent<HTMLInputElement>) => void
  onVerify: () => void
  onResend: () => void
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
    <Card className="w-full max-w-[400px] border-line bg-surface shadow-elevation-1">
      <CardHeader>
        <CardTitle className="text-[1.75rem] font-display">Verify OTP</CardTitle>
        <CardDescription>Enter the 6-digit code sent to your email.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <OtpInput
          digits={digits}
          onSetInputRef={onSetInputRef}
          onUpdateDigit={onUpdateDigit}
          onKeyDown={onKeyDown}
          onPaste={onPaste}
        />
        <div className="flex items-center justify-between gap-3">
          <span className="text-[0.8125rem] text-ink-muted">{timerLabel}</span>
          <button
            type="button"
            className="text-[0.8125rem] text-brand hover:underline disabled:opacity-50 disabled:no-underline"
            disabled={!canResend}
            onClick={onResend}
          >
            Resend code
          </button>
        </div>
        {info && <p className="text-[0.8125rem] text-ink-muted">{info}</p>}
        {error && <p className="text-[0.8125rem] text-danger">{error}</p>}
        <Button className="w-full" disabled={!completed} loading={isVerifying} onClick={onVerify}>
          Verify code
        </Button>
      </CardContent>
    </Card>
  )
}
