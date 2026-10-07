import { otpInputStyles } from "../../styles/forms/otpInput.styles";
import { OtpDigitInput } from "./OtpDigitInput.component";

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
        <OtpDigitInput
          key={index}
          index={index}
          digit={digit}
          onSetInputRef={onSetInputRef}
          onUpdateDigit={onUpdateDigit}
          onKeyDown={onKeyDown}
          onPaste={onPaste}
        />
      ))}
    </div>
  );
}
