import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { OtpInput } from '@/shared/components/OtpInput'

interface OtpCardProps {
  digits: string[]
  completed: boolean
  onSetInputRef: (index: number, node: HTMLInputElement | null) => void
  onUpdateDigit: (index: number, value: string) => void
  onKeyDown: (index: number, event: React.KeyboardEvent<HTMLInputElement>) => void
  onPaste: (event: React.ClipboardEvent<HTMLInputElement>) => void
}

export function OtpCard({
  digits,
  completed,
  onSetInputRef,
  onUpdateDigit,
  onKeyDown,
  onPaste,
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
        <div className="flex items-center justify-between">
          <span className="text-[0.8125rem] text-ink-muted">Resend code in 00:30</span>
          <button type="button" className="text-[0.8125rem] text-brand hover:underline" disabled>
            Resend code
          </button>
        </div>
        <Button className="w-full" disabled={!completed}>Verify code</Button>
      </CardContent>
    </Card>
  )
}
