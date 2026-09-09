import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { formatInr } from "@/shared/utils/formatting/orderFormat";
import { formatPoints } from "@/shared/utils/formatting/formatPoints";
import type { WalletRechargePreviewResponse } from "../../api/wallet/wallet.api";
import { walletRechargePanelStyles as styles } from "../../styles/recharge/walletRechargePanel.styles";

interface WalletRechargePresetButtonsProps {
  presets: number[];
  previews: Array<{ data?: WalletRechargePreviewResponse } | undefined>;
  pointsPerRupee: number;
  disabled: boolean;
  onSelect: (amount: number) => void;
}

export function WalletRechargePresetButtons({
  presets,
  previews,
  pointsPerRupee,
  disabled,
  onSelect,
}: WalletRechargePresetButtonsProps) {
  return (
    <div className={styles.presetsGrid}>
      {presets.map((preset, index) => {
        const preview = previews[index]?.data;
        return (
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
              {pointsPerRupee > 1 && preview?.validationCode === "ok" ? (
                <span className={styles.presetBonusHint}>
                  {formatLabel(LABELS.walletRechargeBonusHint, {
                    amount: formatInr(preset),
                    points: formatPoints(preview.pointsToCredit),
                  })}
                </span>
              ) : null}
            </span>
          </Button>
        );
      })}
    </div>
  );
}
