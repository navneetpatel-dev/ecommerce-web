import Link from 'next/link'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/shared/components/ui/accordion'

const footerSections = [
  {
    title: 'Company',
    links: [
      { href: '/about', label: 'About' },
      { href: '/contact', label: 'Contact' },
      { href: '/blog', label: 'Blog' },
    ],
  },
  {
    title: 'Customer Service',
    links: [
      { href: '/orders', label: 'Track Order' },
      { href: '/faq', label: 'FAQ' },
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/terms', label: 'Terms of Service' },
    ],
  },
  {
    title: 'Sell on Marketplace',
    links: [
      { href: '/vendor/register', label: 'Become a Seller' },
      { href: '/vendor/dashboard/overview', label: 'Vendor Dashboard' },
    ],
  },
  {
    title: 'Connect',
    links: [],
    isNewsletter: true,
  },
]

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      {/* Desktop columns */}
      <div className="hidden lg:grid grid-cols-4 gap-8 max-w-[1600px] mx-auto px-4 py-16">
        {footerSections.map((section) => (
          <div key={section.title}>
            {!section.isNewsletter ? (
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
                <div className="flex gap-2">
                  <Input placeholder="Your email" className="text-[0.9375rem]" />
                  <Button size="sm" className="shrink-0">Subscribe</Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mobile accordion */}
      <div className="lg:hidden px-4 py-8">
        <Accordion type="single" collapsible>
          {footerSections.map((section) => (
            !section.isNewsletter ? (
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
          ))}
        </Accordion>
        <div className="mt-6">
          <h4 className="text-[0.8125rem] font-semibold text-ink mb-2">Newsletter</h4>
          <div className="flex flex-col gap-2">
            <Input placeholder="Your email" className="text-[0.9375rem]" />
            <Button size="sm">Subscribe</Button>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-line py-6">
        <div className="max-w-[1600px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
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
