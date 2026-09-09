import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { PATHS } from "@/shared/constants/paths";
import type {
  DeliveryAgent,
  DeliveryAgentRatings,
} from "@/features/delivery-dashboard";

interface OperatingStatusAsideProps {
  vehicleIcon: LucideIcon;
  agent: DeliveryAgent | undefined;
  ratingsData: DeliveryAgentRatings | undefined;
}

export function OperatingStatusAside({
  vehicleIcon: VehicleIcon,
  agent,
  ratingsData,
}: OperatingStatusAsideProps) {
  const ratingCount = ratingsData?.ratingCount ?? agent?.ratingCount;
  const averageRating = ratingsData?.averageRating ?? agent?.averageRating ?? 0;
  const formattedAverageRating = averageRating.toFixed(1);
  const ratingSuffix = ratingCount === 1 ? "" : "s";
  const ratingSummary = ratingCount ? (
    <>
      <Star className="size-3.5 fill-warning text-warning" aria-hidden="true" />
      <span className="font-medium text-ink">{formattedAverageRating}</span>
      <span className="text-ink-muted">
        ({ratingCount} rating{ratingSuffix})
      </span>
    </>
  ) : (
    <span className="text-ink-muted">No ratings yet</span>
  );

  const partnerName = agent?.fullName ?? "Delivery Partner";
  const dutyStatusLabel = agent?.availableForAssignment
    ? "Available"
    : "Unavailable";
  const stationLabel = agent?.hubOrZone ?? "—";
  const systemStatus = agent?.status ?? "ACTIVE";

  return (
    <aside className="space-y-6">
      <div className="border border-line bg-surface shadow-elevation-1">
        <div className="border-b border-line bg-paper/55 px-5 py-4 md:px-6">
          <TextEyebrow>OPERATING STATUS</TextEyebrow>
          <p className="mt-1 text-[0.875rem] text-ink-muted">
            Live delivery partner status.
          </p>
        </div>

        <div className="space-y-4 p-5 md:p-6">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-line bg-paper text-brand">
              <VehicleIcon size={20} strokeWidth={1.5} />
            </span>
            <div className="min-w-0">
              <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-ink-faint">
                Partner Name
              </p>
              <p className="mt-0.5 font-medium text-ink">{partnerName}</p>
              <p className="text-body-sm text-ink-muted">{agent?.phone}</p>
              <p className="mt-1 flex items-center gap-1 text-body-sm">
                {ratingSummary}
              </p>
            </div>
          </div>

          <div className="border-t border-line/60 pt-4 space-y-2">
            <div className="flex items-center justify-between text-body-sm">
              <span className="text-ink-muted">Duty status:</span>
              <span className="font-medium text-ink">{dutyStatusLabel}</span>
            </div>
            <div className="flex items-center justify-between text-body-sm">
              <span className="text-ink-muted">Station / Hub:</span>
              <span className="font-mono text-ink text-body-sm">
                {stationLabel}
              </span>
            </div>
            <div className="flex items-center justify-between text-body-sm">
              <span className="text-ink-muted">System status:</span>
              <StatusBadge status={systemStatus} />
            </div>
          </div>

          <div className="border-t border-line/60 pt-4">
            <Button
              variant="outline"
              className="w-full gap-2 justify-between"
              asChild
            >
              <Link href={PATHS.delivery.today}>
                <span>Open Field Queue</span>
                <ArrowRight size={15} />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}
