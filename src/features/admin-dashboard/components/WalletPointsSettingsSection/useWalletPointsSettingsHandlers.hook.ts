import { useCallback, type ChangeEvent } from "react";

interface UseWalletPointsSettingsHandlersProps {
  onWalletRechargeEnabledChange: (value: boolean) => void;
  onWalletMinRechargeChange: (value: number) => void;
  onWalletMaxRechargeChange: (value: number) => void;
  onWalletMaxBalanceChange: (value: number) => void;
  onWalletRechargePresetsChange: (value: number[]) => void;
  onPointsPerRupeeChange: (value: number) => void;
  onPromotionalPointsTtlDaysChange: (value: number) => void;
}

export function useWalletPointsSettingsHandlers({
  onWalletRechargeEnabledChange,
  onWalletMinRechargeChange,
  onWalletMaxRechargeChange,
  onWalletMaxBalanceChange,
  onWalletRechargePresetsChange,
  onPointsPerRupeeChange,
  onPromotionalPointsTtlDaysChange,
}: UseWalletPointsSettingsHandlersProps) {
  const handleRechargeEnabledChange = useCallback(
    (value: string) => {
      onWalletRechargeEnabledChange(value === "true");
    },
    [onWalletRechargeEnabledChange],
  );

  const handlePointsPerRupeeChange = useCallback(
    (value: number | undefined) => {
      onPointsPerRupeeChange(value ?? 1);
    },
    [onPointsPerRupeeChange],
  );

  const handleMinRechargeChange = useCallback(
    (value: number | undefined) => {
      onWalletMinRechargeChange(value ?? 100);
    },
    [onWalletMinRechargeChange],
  );

  const handleMaxRechargeChange = useCallback(
    (value: number | undefined) => {
      onWalletMaxRechargeChange(value ?? 10000);
    },
    [onWalletMaxRechargeChange],
  );

  const handleMaxBalanceChange = useCallback(
    (value: number | undefined) => {
      onWalletMaxBalanceChange(value ?? 50000);
    },
    [onWalletMaxBalanceChange],
  );

  const handlePresetsChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const parsed = event.target.value
        .split(",")
        .map((part) => Number(part.trim()))
        .filter((n) => Number.isFinite(n) && n > 0);
      onWalletRechargePresetsChange(parsed);
    },
    [onWalletRechargePresetsChange],
  );

  const handlePromotionalTtlChange = useCallback(
    (value: number | undefined) => {
      onPromotionalPointsTtlDaysChange(value ?? 0);
    },
    [onPromotionalPointsTtlDaysChange],
  );

  return {
    handleRechargeEnabledChange,
    handlePointsPerRupeeChange,
    handleMinRechargeChange,
    handleMaxRechargeChange,
    handleMaxBalanceChange,
    handlePresetsChange,
    handlePromotionalTtlChange,
  };
}
