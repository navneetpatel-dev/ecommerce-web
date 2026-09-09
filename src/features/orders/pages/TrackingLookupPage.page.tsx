"use client";

import { useTrackingLookup } from "../hooks/useTrackingLookup.hook";
import { TrackingForm } from "../components/TrackingForm.component";
import { TrackingResult } from "../components/TrackingResult.component";
import { ordersPagesStyles } from "./ordersPages.styles";

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
