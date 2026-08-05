import { faqItems } from '../data/content'
import { FaqView } from '../components/FaqView'

export function FaqPage() {
  return <FaqView items={faqItems} />
}
