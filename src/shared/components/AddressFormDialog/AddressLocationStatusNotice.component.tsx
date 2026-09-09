import { MapPin } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import type { LocationCaptureStatus } from "../../hooks/address-form-dialog/useCaptureLocation.hook";
import { addressFormDialogStyles } from "../../styles/address-form-dialog/addressFormDialog.styles";

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
    <div className={addressFormDialogStyles.locationNotice}>
      <span className={addressFormDialogStyles.locationNoticeText}>
        <MapPin
          className={addressFormDialogStyles.locationPinIcon}
          aria-hidden="true"
        />
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
