import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/card'

interface TrackingResultProps {
  status: string
  lastUpdate: string
}

export function TrackingResult({ status, lastUpdate }: TrackingResultProps) {
  return (
    <Card>
      <CardHeader><CardTitle>Tracking Result</CardTitle></CardHeader>
      <CardContent>
        <p>Status: <span className="font-medium">{status}</span></p>
        <p className="text-[0.9375rem] text-ink-muted">Last update: {new Date(lastUpdate).toLocaleString()}</p>
      </CardContent>
    </Card>
  )
}
