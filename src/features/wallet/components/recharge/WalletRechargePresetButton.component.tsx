"use client";

import { useCallback } from "react";
import { Button } from "@/shared/components/ui/button";
import { formatInr } from "@/shared/utils/formatting/orderFormat";
import { walletRechargePanelStyles as styles } from "../../styles/recharge/walletRechargePanel.styles";

interface WalletRechargePresetButtonProps {
  amount: number;
  disabled: boolean;
  onSelect: (amount: number) => void;
}

/** One preset top-up amount. */
export function WalletRechargePresetButton({
  amount,
  disabled,
  onSelect,
}: WalletRechargePresetButtonProps) {
  const handleClick = useCallback(() => {
    onSelect(amount);
  }, [amount, onSelect]);

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={disabled}
      className={styles.presetButton}
      onClick={handleClick}
    >
      <span className={styles.presetContent}>
        <span>{formatInr(amount)}</span>
      </span>
    </Button>
  );
}
