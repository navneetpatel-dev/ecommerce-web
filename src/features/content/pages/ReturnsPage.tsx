import { returnTimelineSteps } from '../data/content'
import { ReturnsView } from '../components/ReturnsView'

export function ReturnsPage() {
  return <ReturnsView timelineSteps={returnTimelineSteps} />
}
