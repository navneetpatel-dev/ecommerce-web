import { useCallback } from "react";
import { useDelimitedListInput } from "@/shared/hooks/forms/useDelimitedListInput.hook";

interface UseWalletPointsSettingsHandlersProps {
  onWalletRechargeEnabledChange: (value: boolean) => void;
  onWalletMinRechargeChange: (value: number) => void;
  onWalletMaxRechargeChange: (value: number) => void;
  onWalletMaxBalanceChange: (value: number) => void;
  onWalletRechargePresetsChange: (value: number[]) => void;
  onPromotionalPointsTtlDaysChange: (value: number) => void;
  walletRechargePresetsInr: readonly number[];
}

const parsePresets = (text: string): number[] =>
  text
    .split(",")
    .map((part) => Number(part.trim()))
    .filter((n) => Number.isFinite(n) && n > 0);

export function useWalletPointsSettingsHandlers({
  onWalletRechargeEnabledChange,
  onWalletMinRechargeChange,
  onWalletMaxRechargeChange,
  onWalletMaxBalanceChange,
  onWalletRechargePresetsChange,
  onPromotionalPointsTtlDaysChange,
  walletRechargePresetsInr,
}: UseWalletPointsSettingsHandlersProps) {
  const handleRechargeEnabledChange = useCallback(
    (value: string) => {
      onWalletRechargeEnabledChange(value === "true");
    },
    [onWalletRechargeEnabledChange],
  );

  const handleMinRechargeChange = useCallback(
    (value: number | undefined) => {
      onWalletMinRechargeChange(value ?? 1);
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

  const { text: presetsText, handleChange: handlePresetsChange } =
    useDelimitedListInput(
      walletRechargePresetsInr,
      parsePresets,
      onWalletRechargePresetsChange,
    );

  const handlePromotionalTtlChange = useCallback(
    (value: number | undefined) => {
      onPromotionalPointsTtlDaysChange(value ?? 0);
    },
    [onPromotionalPointsTtlDaysChange],
  );

  return {
    handleRechargeEnabledChange,
    handleMinRechargeChange,
    handleMaxRechargeChange,
    handleMaxBalanceChange,
    presetsText,
    handlePresetsChange,
    handlePromotionalTtlChange,
  };
}
