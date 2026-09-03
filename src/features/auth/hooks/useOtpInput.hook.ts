"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { navigateReplace } from "@/shared/utils/navigate";
import { PATHS } from "@/shared/constants/paths";
import { LABELS } from "@/shared/constants/labels";
import { ERROR_CODES } from "@/shared/constants/errors";
import { isApiErrorCode } from "@/shared/types/apiError.types";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import { useOtpLogin, useRequestOtp } from "../api/otp.queries";
import { useOtpDigits } from "./useOtpDigits.hook";

export function useOtpInput(length = 6) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email")?.trim() ?? "";
  const redirect = searchParams.get("redirect");
  const requestOtp = useRequestOtp();
  const otpLogin = useOtpLogin();
  const otp = useOtpDigits(length);
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const initialRequestStarted = useRef(false);

  useEffect(() => {
    if (!email) {
      navigateReplace(router, PATHS.login);
      return;
    }
    if (initialRequestStarted.current) return;
    initialRequestStarted.current = true;
    requestOtp.mutate(email, {
      onError: (requestError) => {
        setNeedsVerification(
          isApiErrorCode(requestError, ERROR_CODES.EMAIL_NOT_VERIFIED),
        );
        setError(getApiErrorMessage(requestError, LABELS.otpRequestFailed));
      },
    });
  }, [email, requestOtp, router]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = window.setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [secondsLeft]);

  const updateDigit = (index: number, value: string) => {
    setError(null);
    otp.updateDigit(index, value);
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    setError(null);
    otp.handlePaste(event);
  };

  const verify = async () => {
    if (!otp.completed) return;
    setIsVerifying(true);
    setError(null);
    try {
      await otpLogin.mutateAsync({
        email,
        code: otp.digits.join(""),
        redirect,
      });
    } catch (verifyError) {
      setError(getApiErrorMessage(verifyError, LABELS.otpVerifyFailed));
    } finally {
      setIsVerifying(false);
    }
  };

  const resend = async () => {
    if (secondsLeft > 0) return;
    setError(null);
    try {
      await requestOtp.mutateAsync(email);
      setNeedsVerification(false);
      otp.reset();
      setSecondsLeft(30);
      setInfo(LABELS.otpSent);
    } catch (requestError) {
      setNeedsVerification(
        isApiErrorCode(requestError, ERROR_CODES.EMAIL_NOT_VERIFIED),
      );
      setError(getApiErrorMessage(requestError, LABELS.otpRequestFailed));
    }
  };

  const timerLabel =
    secondsLeft > 0
      ? `Resend code in 00:${String(secondsLeft).padStart(2, "0")}`
      : "You can resend a code now";
  const canResend = secondsLeft <= 0;

  return {
    digits: otp.digits,
    completed: otp.completed,
    error,
    info,
    isVerifying,
    timerLabel,
    canResend,
    needsVerification,
    email,
    setInputRef: otp.setInputRef,
    updateDigit,
    handleKeyDown: otp.handleKeyDown,
    handlePaste,
    verify,
    resend,
  };
}
