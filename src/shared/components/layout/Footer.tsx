'use client'

import Link from 'next/link'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/shared/components/ui/accordion'
import { NewsletterFormContainer } from '@/shared/containers/NewsletterFormContainer'
import { FOOTER_SECTIONS } from '@/shared/constants/footer'

export function Footer() {
  return (
    <footer className="mt-16 lg:mt-24 border-t border-line bg-surface">
      <div className="storefront-container hidden grid-cols-4 gap-8 py-16 lg:grid">
        {FOOTER_SECTIONS.map((section) => (
          <div key={section.title}>
            {!('isNewsletter' in section && section.isNewsletter) ? (
              <>
                <h4 className="text-[0.8125rem] font-semibold text-ink mb-4">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-[0.8125rem] text-ink-muted hover:text-ink transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <div>
                <h4 className="text-[0.8125rem] font-semibold text-ink mb-4">Newsletter</h4>
                <p className="text-[0.8125rem] text-ink-muted mb-3">
                  Get the latest deals and new arrivals.
                </p>
                <NewsletterFormContainer idPrefix="desktop" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="storefront-container py-8 lg:hidden">
        <Accordion type="single" collapsible>
          {FOOTER_SECTIONS.map((section) =>
            !('isNewsletter' in section && section.isNewsletter) ? (
              <AccordionItem key={section.title} value={section.title}>
                <AccordionTrigger>{section.title}</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2">
                    {section.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="text-[0.8125rem] text-ink-muted hover:text-ink transition-colors"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ) : null
          )}
        </Accordion>
        <div className="mt-6">
          <h4 className="text-[0.8125rem] font-semibold text-ink mb-2">Newsletter</h4>
          <NewsletterFormContainer idPrefix="mobile" />
        </div>
      </div>

      <div className="border-t border-line py-6">
        <div className="storefront-container flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-[0.8125rem] text-ink-muted">
            Marketplace &copy; {new Date().getFullYear()}
          </p>
          <div className="flex items-center gap-4 text-[0.8125rem] text-ink-muted">
            <span>Visa</span>
            <span>Mastercard</span>
            <span>UPI</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
