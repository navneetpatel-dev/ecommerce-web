import { Button } from "@/shared/components/ui/button";
import { formatInr } from "@/shared/utils/formatting/orderFormat";
import { walletRechargePanelStyles as styles } from "../../styles/recharge/walletRechargePanel.styles";

interface WalletRechargePresetButtonsProps {
  presets: number[];
  disabled: boolean;
  onSelect: (amount: number) => void;
}

export function WalletRechargePresetButtons({
  presets,
  disabled,
  onSelect,
}: WalletRechargePresetButtonsProps) {
  return (
    <div className={styles.presetsGrid}>
      {presets.map((preset) => (
        <Button
          key={preset}
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          className={styles.presetButton}
          onClick={() => onSelect(preset)}
        >
          <span className={styles.presetContent}>
            <span>{formatInr(preset)}</span>
          </span>
        </Button>
      ))}
    </div>
  );
}
