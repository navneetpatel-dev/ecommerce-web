import { Button } from "@/shared/components/ui/button";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import {
  MILESTONE_CARD_BODY,
  MILESTONE_CARD_DESC,
  MILESTONE_CARD_EYEBROW,
  MILESTONE_CARD_HEADER,
  MILESTONE_CARD_ROOT,
  MILESTONE_CARD_TITLE,
} from "../../styles/deliveries/deliveryMilestoneCard.styles";

interface DeliveryMilestoneCardProps {
  label: string;
  loading: boolean;
  onAdvance: () => void;
}

/** "Update status to proceed" card shown for the current in-flight milestone. */
export function DeliveryMilestoneCard({
  label,
  loading,
  onAdvance,
}: DeliveryMilestoneCardProps) {
  return (
    <div className={MILESTONE_CARD_ROOT}>
      <div className={MILESTONE_CARD_HEADER}>
        <TextEyebrow className={MILESTONE_CARD_EYEBROW}>
          Milestone Progress
        </TextEyebrow>
      </div>
      <div className={MILESTONE_CARD_BODY}>
        <div>
          <h2 className={MILESTONE_CARD_TITLE}>{label}</h2>
          <p className={MILESTONE_CARD_DESC}>
            Update the task status to proceed with the fulfillment schedule.
          </p>
        </div>
        <Button size="lg" loading={loading} onClick={onAdvance}>
          {label}
        </Button>
      </div>
    </div>
  );
}
