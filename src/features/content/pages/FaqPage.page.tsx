import { faqItems } from "../constants/siteContent";
import { FaqView } from "../components/FaqView.component";

export function FaqPage() {
  return <FaqView items={faqItems} />;
}
