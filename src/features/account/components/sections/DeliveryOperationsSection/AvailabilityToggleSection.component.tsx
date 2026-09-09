import { Switch } from "@/shared/components/ui/switch";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import type { useSetAvailability } from "@/features/delivery-dashboard";

interface AvailabilityToggleSectionProps {
  availableForAssignment: boolean | undefined;
  hasAgent: boolean;
  availability: ReturnType<typeof useSetAvailability>;
}

export function AvailabilityToggleSection({
  availableForAssignment,
  hasAgent,
  availability,
}: AvailabilityToggleSectionProps) {
  return (
    <section className="border border-line bg-surface shadow-elevation-1">
      <div className="border-b border-line bg-paper/55 px-5 py-4 md:px-6">
        <TextEyebrow>FIELD CONTROLS</TextEyebrow>
        <h2 className="mt-1 font-display text-[1.125rem] font-medium text-ink">
          Live assignment availability
        </h2>
        <p className="mt-1 text-[0.875rem] text-ink-muted">
          Configure whether operations can assign new deliveries and return
          pickups to you.
        </p>
      </div>

      <div className="p-5 md:p-6">
        <div className="flex flex-col gap-4 rounded-lg border border-line bg-paper/40 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-ink">
                Available for task assignments
              </span>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.75rem] font-medium ${
                  availableForAssignment
                    ? "bg-success/10 text-success border border-success/20"
                    : "bg-ink-muted/10 text-ink-muted border border-line"
                }`}
              >
                <span
                  className={`size-1.5 rounded-full ${
                    availableForAssignment ? "bg-success" : "bg-ink-muted"
                  }`}
                />
                {availableForAssignment ? "On Duty" : "Off Duty"}
              </span>
            </div>
            <p className="text-body-sm text-ink-muted">
              Operations dispatch can assign active shipments and scheduled
              return pickups while enabled.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Switch
              checked={availableForAssignment ?? false}
              disabled={!hasAgent || availability.isPending}
              onCheckedChange={(checked) => availability.mutate(checked)}
            />
          </div>
        </div>
        {availability.isError ? (
          <p className="mt-3 text-body-sm text-danger">
            {getApiErrorMessage(
              availability.error,
              "Could not update availability.",
            )}
          </p>
        ) : null}
      </div>
    </section>
  );
}
