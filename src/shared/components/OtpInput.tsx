interface OtpInputProps {
  digits: string[]
  onSetInputRef: (index: number, node: HTMLInputElement | null) => void
  onUpdateDigit: (index: number, value: string) => void
  onKeyDown: (index: number, event: React.KeyboardEvent<HTMLInputElement>) => void
  onPaste: (event: React.ClipboardEvent<HTMLInputElement>) => void
}

export function OtpInput({
  digits,
  onSetInputRef,
  onUpdateDigit,
  onKeyDown,
  onPaste,
}: OtpInputProps) {
  return (
    <div className="flex items-center gap-2">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(node) => onSetInputRef(index, node)}
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digit}
          onChange={(e) => onUpdateDigit(index, e.target.value)}
          onKeyDown={(event) => onKeyDown(index, event)}
          onPaste={onPaste}
          className="h-11 w-11 rounded-sm border border-line bg-surface text-center text-[0.9375rem] font-semibold text-ink outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          aria-label={`OTP digit ${index + 1}`}
        />
      ))}
    </div>
  )
}
