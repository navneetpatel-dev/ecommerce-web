import { Button } from "@/shared/components/ui/button";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";

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
    <div className="border border-line bg-surface shadow-elevation-1">
      <div className="border-b border-line bg-paper/55 px-5 py-3.5">
        <TextEyebrow className="!mb-0">Milestone Progress</TextEyebrow>
      </div>
      <div className="space-y-4 p-5 md:p-6">
        <div>
          <h2 className="font-display text-[1.125rem] font-medium text-ink">
            {label}
          </h2>
          <p className="mt-1 text-body-sm text-ink-muted">
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
