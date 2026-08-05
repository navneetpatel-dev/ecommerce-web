import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/shared/components/ui/accordion'

interface FaqItem {
  q: string
  a: string
}

interface FaqViewProps {
  items: readonly FaqItem[]
}

export function FaqView({ items }: FaqViewProps) {
  return (
    <div className="max-w-[900px] mx-auto px-4 py-10">
      <h1 className="text-[1.75rem] font-semibold text-ink mb-6">Frequently Asked Questions</h1>
      <Accordion type="single" collapsible>
        {items.map((item) => (
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
