import { MapPin } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import type { LocationCaptureStatus } from "@/shared/hooks/useCaptureLocation.hook";

const LOCATION_STATUS_MESSAGE: Record<
  Exclude<LocationCaptureStatus, "success">,
  string
> = {
  pending: LABELS.addressLocationFetching,
  denied: LABELS.addressLocationDenied,
  unsupported: LABELS.addressLocationUnsupported,
  error: LABELS.addressLocationError,
};

interface AddressLocationStatusNoticeProps {
  status: Exclude<LocationCaptureStatus, "success">;
  onRetry?: () => void;
}

/** Inline banner shown while geolocation capture is pending, denied, or failed. */
export function AddressLocationStatusNotice({
  status,
  onRetry,
}: AddressLocationStatusNoticeProps) {
  return (
    <div className="sm:col-span-2 flex items-center justify-between gap-3 rounded-md border border-line bg-warning/10 px-3 py-2 text-body-sm text-ink">
      <span className="flex items-center gap-2">
        <MapPin className="size-4 shrink-0 text-warning" aria-hidden="true" />
        {LOCATION_STATUS_MESSAGE[status]}
      </span>
      {status !== "pending" ? (
        <Button type="button" variant="outline" size="sm" onClick={onRetry}>
          {LABELS.addressLocationRetry}
        </Button>
      ) : null}
    </div>
  );
}
