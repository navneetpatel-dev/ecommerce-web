"use client";

import { useCallback, type ChangeEvent, type KeyboardEvent } from "react";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { otpInputStyles } from "../../styles/forms/otpInput.styles";

interface OtpDigitInputProps {
  index: number;
  digit: string;
  onSetInputRef: (index: number, node: HTMLInputElement | null) => void;
  onUpdateDigit: (index: number, value: string) => void;
  onKeyDown: (index: number, event: KeyboardEvent<HTMLInputElement>) => void;
  onPaste: (event: React.ClipboardEvent<HTMLInputElement>) => void;
}

/** One single-character OTP cell. */
export function OtpDigitInput({
  index,
  digit,
  onSetInputRef,
  onUpdateDigit,
  onKeyDown,
  onPaste,
}: OtpDigitInputProps) {
  const handleRef = useCallback(
    (node: HTMLInputElement | null) => {
      onSetInputRef(index, node);
    },
    [index, onSetInputRef],
  );

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onUpdateDigit(index, event.target.value);
    },
    [index, onUpdateDigit],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      onKeyDown(index, event);
    },
    [index, onKeyDown],
  );

  return (
    <input
      ref={handleRef}
      inputMode="numeric"
      autoComplete="one-time-code"
      pattern="[0-9]*"
      maxLength={1}
      value={digit}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onPaste={onPaste}
      className={otpInputStyles.input}
      aria-label={formatLabel(LABELS.otpDigit, { index: index + 1 })}
    />
  );
}
