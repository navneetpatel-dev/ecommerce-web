'use client'

import { useTrackingLookup } from '../hooks/useTrackingLookup'
import { TrackingForm } from '../components/TrackingForm'
import { TrackingResult } from '../components/TrackingResult'

export function TrackingLookupPage() {
  const tracking = useTrackingLookup()

  return (
    <div className="max-w-md mx-auto px-4 py-8 space-y-4">
      <h1 className="font-display text-[1.375rem] font-semibold text-ink">Track Shipment</h1>
      <TrackingForm
        trackingNumber={tracking.trackingNumber}
        onTrackingNumberChange={tracking.setTrackingNumber}
        onSubmit={tracking.lookup}
      />
      {tracking.result && (
        <TrackingResult status={tracking.result.status} lastUpdate={tracking.result.lastUpdate} />
      )}
    </div>
  )
}
