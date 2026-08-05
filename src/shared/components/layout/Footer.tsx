'use client'

import { useState } from 'react'
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

const NEWSLETTER_KEY = 'newsletter-subscribed-email'

function NewsletterForm({ idPrefix }: { idPrefix: string }) {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const trimmed = email.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Enter a valid email address')
      setMessage(null)
      return
    }
    try {
      localStorage.setItem(NEWSLETTER_KEY, trimmed)
    } catch {
      // ignore storage failures
    }
    setError(null)
    setMessage("Thanks — you're subscribed for deal alerts.")
    setEmail('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <label htmlFor={`${idPrefix}-newsletter-email`} className="block text-[0.8125rem] font-medium text-ink mb-2">
        Email
      </label>
      <div className="flex gap-2">
        <Input
          id={`${idPrefix}-newsletter-email`}
          type="email"
          placeholder="Your email"
          className="text-[0.9375rem]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit" size="sm" className="shrink-0">
          Subscribe
        </Button>
      </div>
      {error && <p className="text-[0.8125rem] text-danger">{error}</p>}
      {message && <p className="text-[0.8125rem] text-success">{message}</p>}
    </form>
  )
}

export function Footer() {
  return (
    <footer className="mt-16 lg:mt-24 border-t border-line bg-surface">
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
                <NewsletterForm idPrefix="desktop" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="lg:hidden px-4 py-8">
        <Accordion type="single" collapsible>
          {footerSections.map((section) =>
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
          )}
        </Accordion>
        <div className="mt-6">
          <h4 className="text-[0.8125rem] font-semibold text-ink mb-2">Newsletter</h4>
          <NewsletterForm idPrefix="mobile" />
        </div>
      </div>

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
