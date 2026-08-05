import { Input } from '@/shared/components/ui/input'
import { Textarea } from '@/shared/components/ui/textarea'
import { Button } from '@/shared/components/ui/button'

export default function ContactPage() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
      <section className="space-y-4">
        <h1 className="text-[1.75rem] font-semibold text-ink">Contact Us</h1>
        <p className="text-[0.9375rem] text-ink-muted">Have a question about orders, shipping, or returns? Send us a message.</p>
        <div className="space-y-3">
          <div>
            <label className="text-[0.8125rem] font-medium text-ink mb-2 block">Name</label>
            <Input placeholder="Your name" />
          </div>
          <div>
            <label className="text-[0.8125rem] font-medium text-ink mb-2 block">Email</label>
            <Input type="email" placeholder="you@example.com" />
          </div>
          <div>
            <label className="text-[0.8125rem] font-medium text-ink mb-2 block">Message</label>
            <Textarea placeholder="How can we help?" />
          </div>
          <Button>Send message</Button>
        </div>
      </section>
      <aside className="bg-surface border border-line rounded-md p-5 space-y-3">
        <h2 className="text-[1.125rem] font-semibold text-ink">Support Details</h2>
        <p className="text-[0.9375rem] text-ink-muted">Email: support@marketplace.local</p>
        <p className="text-[0.9375rem] text-ink-muted">Working hours: Mon–Sat, 9:00 AM to 7:00 PM</p>
      </aside>
    </div>
  )
}
