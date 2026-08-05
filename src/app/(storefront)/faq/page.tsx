import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/shared/components/ui/accordion'

const faqItems = [
  { q: 'How does multi-vendor shipping work?', a: 'Products from different vendors may ship separately with their own tracking updates.' },
  { q: 'Can I return items from one vendor only?', a: 'Yes. Returns are handled per eligible order item and vendor return policy.' },
  { q: 'When is payment captured?', a: 'Payment is captured during checkout confirmation through the selected payment method.' },
]

export default function FaqPage() {
  return (
    <div className="max-w-[900px] mx-auto px-4 py-10">
      <h1 className="text-[1.75rem] font-semibold text-ink mb-6">Frequently Asked Questions</h1>
      <Accordion type="single" collapsible>
        {faqItems.map((item) => (
          <AccordionItem key={item.q} value={item.q}>
            <AccordionTrigger>{item.q}</AccordionTrigger>
            <AccordionContent>
              <p className="text-[0.9375rem] text-ink-muted">{item.a}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
