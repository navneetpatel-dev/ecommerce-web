import { otpInputStyles } from "./otpInput.styles";

interface OtpInputProps {
  digits: string[];
  onSetInputRef: (index: number, node: HTMLInputElement | null) => void;
  onUpdateDigit: (index: number, value: string) => void;
  onKeyDown: (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => void;
  onPaste: (event: React.ClipboardEvent<HTMLInputElement>) => void;
}

export function OtpInput({
  digits,
  onSetInputRef,
  onUpdateDigit,
  onKeyDown,
  onPaste,
}: OtpInputProps) {
  return (
    <div className={otpInputStyles.container}>
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
          className={otpInputStyles.input}
          aria-label={`OTP digit ${index + 1}`}
        />
      ))}
    </div>
  );
}
