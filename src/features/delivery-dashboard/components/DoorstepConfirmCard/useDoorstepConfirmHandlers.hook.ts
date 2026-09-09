import { useCallback } from "react";

interface UseDoorstepConfirmHandlersParams {
  onOtpCodeChange: (code: string) => void;
  onProofChange: (file: File | null) => void;
  onCodCollectedChange?: (collected: boolean) => void;
}

export function useDoorstepConfirmHandlers({
  onOtpCodeChange,
  onProofChange,
  onCodCollectedChange,
}: UseDoorstepConfirmHandlersParams) {
  const handleOtpInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onOtpCodeChange(e.target.value.replace(/\D/g, "").slice(0, 6));
    },
    [onOtpCodeChange],
  );

  const handleProofInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onProofChange(e.target.files?.[0] ?? null);
    },
    [onProofChange],
  );

  const handleCodCollectedChange = useCallback(
    (checked: boolean) => {
      onCodCollectedChange?.(checked);
    },
    [onCodCollectedChange],
  );

  return {
    handleOtpInputChange,
    handleProofInputChange,
    handleCodCollectedChange,
  };
}
