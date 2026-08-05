export default function TermsPage() {
  return (
    <div className="max-w-[65ch] mx-auto px-4 py-10 space-y-5">
      <h1 className="text-[1.75rem] font-semibold text-ink">Terms of Service</h1>
      <p className="text-[0.9375rem] text-ink-muted">
        By using Marketplace, you agree to follow platform policies for account usage, order behavior, and vendor interactions.
      </p>
      <h2 className="text-[1.125rem] font-semibold text-ink">Orders and payments</h2>
      <p className="text-[0.9375rem] text-ink-muted">
        Orders may be split by vendor. Payment and refund timelines follow the selected payment method and applicable policy.
      </p>
      <h2 className="text-[1.125rem] font-semibold text-ink">Returns and disputes</h2>
      <p className="text-[0.9375rem] text-ink-muted">
        Return eligibility depends on item type, vendor policy, and order state. Disputes are handled through support review.
      </p>
    </div>
  )
}
