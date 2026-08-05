export default function PrivacyPage() {
  return (
    <div className="max-w-[65ch] mx-auto px-4 py-10 space-y-5">
      <h1 className="text-[1.75rem] font-semibold text-ink">Privacy Policy</h1>
      <p className="text-[0.9375rem] text-ink-muted">
        We collect account, order, and usage information required to provide marketplace functionality, shipping,
        payments, and support.
      </p>
      <h2 className="text-[1.125rem] font-semibold text-ink">How we use data</h2>
      <p className="text-[0.9375rem] text-ink-muted">
        Data is used to process orders, prevent abuse, and improve product experience. Vendor-facing information
        is limited to what is required for fulfillment.
      </p>
      <h2 className="text-[1.125rem] font-semibold text-ink">Contact</h2>
      <p className="text-[0.9375rem] text-ink-muted">For privacy questions, contact privacy@marketplace.local.</p>
    </div>
  )
}
