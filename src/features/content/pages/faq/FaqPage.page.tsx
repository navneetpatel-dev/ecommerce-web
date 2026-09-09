import { faqItems } from "../../constants/site/siteContent";
import { FaqView } from "../../components/faq/FaqView.component";

export function FaqPage() {
  return <FaqView items={faqItems} />;
}
