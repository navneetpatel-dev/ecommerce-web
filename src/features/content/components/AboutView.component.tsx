export function AboutView() {
  return (
    <div className="max-w-[65ch] mx-auto px-4 py-10 space-y-6">
      <h1 className="text-[1.75rem] font-semibold text-ink">
        About Marketplace
      </h1>
      <p className="text-body text-ink-muted">
        Marketplace connects shoppers with independent vendors across
        categories. We focus on trusted buying, clear vendor identity, and
        predictable checkout for multi-vendor orders.
      </p>
      <p className="text-body text-ink-muted">
        Every order may include products from different vendors, and each vendor
        is responsible for inventory, shipping, and fulfillment timelines.
      </p>
    </div>
  );
}
