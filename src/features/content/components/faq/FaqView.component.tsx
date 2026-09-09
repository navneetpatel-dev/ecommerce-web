import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/shared/components/ui/accordion";
import { faqViewStyles as styles } from "../../styles/faq/faqView.styles";

interface FaqItem {
  q: string;
  a: string;
}

interface FaqViewProps {
  items: readonly FaqItem[];
}

export function FaqView({ items }: FaqViewProps) {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Frequently Asked Questions</h1>
      <Accordion type="single" collapsible>
        {items.map((item) => (
          <AccordionItem key={item.q} value={item.q}>
            <AccordionTrigger>{item.q}</AccordionTrigger>
            <AccordionContent>
              <p className={styles.answer}>{item.a}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
