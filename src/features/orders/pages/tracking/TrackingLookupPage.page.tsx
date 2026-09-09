"use client";

import { useTrackingLookup } from "../../hooks/tracking/useTrackingLookup.hook";
import { TrackingForm } from "../../components/tracking/TrackingForm.component";
import { TrackingResult } from "../../components/tracking/TrackingResult.component";
import { ordersPagesStyles } from "../list/ordersPages.styles";

export function TrackingLookupPage() {
  const tracking = useTrackingLookup();

  return (
    <div className={ordersPagesStyles.trackingContainer}>
      <h1 className={ordersPagesStyles.trackingTitle}>Track Shipment</h1>
      <TrackingForm
        trackingNumber={tracking.trackingNumber}
        onTrackingNumberChange={tracking.setTrackingNumber}
        onSubmit={tracking.lookup}
      />
      {tracking.error ? (
        <p className={ordersPagesStyles.trackingError}>{tracking.error}</p>
      ) : null}
      {tracking.result && (
        <TrackingResult
          result={tracking.result}
          onReschedule={tracking.reschedule}
          isRescheduling={tracking.isRescheduling}
        />
      )}
    </div>
  );
}
