import { Timeline } from '@/shared/components/Timeline'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Textarea } from '@/shared/components/ui/textarea'
import { Button } from '@/shared/components/ui/button'

interface TimelineStep {
  label: string
  status: 'completed' | 'current' | 'upcoming'
  timestamp?: string
}

interface ReturnsViewProps {
  timelineSteps: readonly TimelineStep[]
}

export function ReturnsView({ timelineSteps }: ReturnsViewProps) {
  return (
    <div className="max-w-[1000px] mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
      <section className="space-y-4">
        <h1 className="text-[1.75rem] font-semibold text-ink">Request a Return</h1>
        <div>
          <label className="text-[0.8125rem] font-medium text-ink mb-2 block">Reason</label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select return reason" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="damaged">Item damaged</SelectItem>
              <SelectItem value="wrong_item">Wrong item received</SelectItem>
              <SelectItem value="not_described">Not as described</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-[0.8125rem] font-medium text-ink mb-2 block">Details</label>
          <Textarea placeholder="Share the issue with your order item." />
        </div>
        <Button>Submit return request</Button>
      </section>

      <section className="bg-surface border border-line rounded-md p-5">
        <h2 className="text-[1.125rem] font-semibold text-ink mb-4">Return Status Timeline</h2>
        <Timeline steps={[...timelineSteps]} />
      </section>
    </div>
  )
}
