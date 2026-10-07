import { WalletRechargePresetButton } from "./WalletRechargePresetButton.component";
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
        <WalletRechargePresetButton
          key={preset}
          amount={preset}
          disabled={disabled}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
