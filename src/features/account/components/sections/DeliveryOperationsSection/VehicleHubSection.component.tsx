import { MapPin } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";

interface VehicleHubSectionProps {
  vehicleIcon: LucideIcon;
  vehicleType: string | undefined;
  hubOrZone: string | undefined;
}

export function VehicleHubSection({
  vehicleIcon: VehicleIcon,
  vehicleType,
  hubOrZone,
}: VehicleHubSectionProps) {
  return (
    <section className="border border-line bg-surface shadow-elevation-1">
      <div className="border-b border-line bg-paper/55 px-5 py-4 md:px-6">
        <TextEyebrow>DISPATCH REGISTRY</TextEyebrow>
        <h2 className="mt-1 font-display text-[1.125rem] font-medium text-ink">
          Fleet details & operating zone
        </h2>
        <p className="mt-1 text-[0.875rem] text-ink-muted">
          Your registered vehicle class and geographic operating zone.
        </p>
      </div>

      <div className="p-5 md:p-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-3.5 rounded-lg border border-line bg-paper/40 p-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-line bg-surface text-brand">
              <VehicleIcon size={20} strokeWidth={1.5} />
            </span>
            <div>
              <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-ink-faint">
                Vehicle Class
              </p>
              <p className="font-medium text-ink">
                {vehicleType ?? "Not registered"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 rounded-lg border border-line bg-paper/40 p-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-line bg-surface text-brand">
              <MapPin size={20} strokeWidth={1.5} />
            </span>
            <div>
              <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-ink-faint">
                Operating Hub / Zone
              </p>
              <p className="font-medium text-ink">
                {hubOrZone ?? "Unassigned"}
              </p>
            </div>
          </div>
        </div>

        <p className="text-body-sm text-ink-faint">
          Vehicle type and hub assignments are verified and updated by the
          platform operations team.
        </p>
      </div>
    </section>
  );
}
