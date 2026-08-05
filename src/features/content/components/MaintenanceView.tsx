export function MaintenanceView() {
  return (
    <div className="min-h-screen bg-paper flex flex-col items-center justify-center px-4 py-10 text-center">
      <div className="max-w-md space-y-4">
        <h1 className="font-display text-ink" style={{ fontSize: 'var(--text-display-sm)' }}>
          Scheduled maintenance
        </h1>
        <p className="text-[0.9375rem] text-ink-muted">
          We&apos;re making improvements to the marketplace. Please check back shortly.
        </p>
        <p className="text-[0.8125rem] text-ink-faint">
          Estimated return time: shortly
        </p>
      </div>
    </div>
  )
}
