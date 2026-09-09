export const authFormsStyles = {
  cardRoot:
    "relative overflow-hidden rounded-xl border border-line/90 bg-surface/95 shadow-elevation-3 ring-1 ring-inset ring-white/[0.04] backdrop-blur-sm",
  cardHeader:
    "space-y-1.5 border-b border-line/80 bg-gradient-to-b from-paper/55 to-paper/25 px-5 py-5 sm:space-y-2 sm:px-8 sm:py-8",
  cardTitle:
    "font-display text-[1.5rem] font-semibold leading-tight tracking-tight text-ink sm:text-[2rem]",
  cardDescription:
    "max-w-prose text-[0.875rem] leading-relaxed text-ink-muted sm:text-[1rem]",
  cardBody: "space-y-5 px-5 py-5 sm:space-y-6 sm:px-8 sm:py-8",
  cardFooter: "border-t border-line/80 bg-paper/30 px-5 py-4 sm:px-8 sm:py-5",
  footerLink:
    "block text-center text-body font-medium text-brand transition-colors hover:text-brand-hover hover:underline",
  footerText: "text-center text-body text-ink-muted",
  footerLinkInline:
    "font-medium text-brand transition-colors hover:text-brand-hover hover:underline",
  successBanner:
    "rounded-md border border-success/25 bg-success-subtle/60 px-4 py-3 text-body text-success",
  dangerBanner:
    "rounded-md border border-danger/25 bg-danger-subtle/60 px-4 py-3 text-body text-danger",
  registeredEmailText: "mt-1 font-medium",
  formSpace4: "space-y-4",
  formSpace5: "space-y-5",
  fullWidth: "w-full",
  oauthGroup: "space-y-3",
  googleIcon: "h-4 w-4 shrink-0",
  dividerRoot: "relative w-full",
  dividerLineWrapper: "absolute inset-0 flex items-center",
  dividerLine: "w-full border-t border-line",
  dividerTextWrapper:
    "relative flex justify-center text-[0.75rem] font-medium uppercase tracking-[0.08em]",
  dividerText: "bg-surface px-3 text-ink-faint",
  impersonationBanner:
    "sticky top-0 z-50 flex items-center justify-between gap-3 bg-warning px-4 py-2 text-body-sm font-medium text-ink",
  impersonationButton: "border-ink/30 bg-transparent text-ink hover:bg-ink/10",
  forgotPasswordLink:
    "text-body-sm font-medium text-brand transition-colors hover:text-brand-hover hover:underline",
  resendWrapper: "flex flex-col items-start gap-2",
  mutedBodySm: "text-body-sm text-ink-muted",
  mutedBody: "text-body text-ink-muted",
  dangerBodySm: "text-body-sm text-danger",
  changePasswordSuccessWrapper: "space-y-3",
  changePasswordSuccessText: "text-body text-success",
  changePasswordForm: "space-y-4 sm:col-span-2",
  otpTimerRow: "flex items-center justify-between gap-3",
  resendLinkButton:
    "h-auto min-h-0 max-h-none px-0 py-0 text-body-sm font-medium text-brand hover:text-brand-hover",
  callbackContainer: "rounded-md border border-line bg-surface p-8 text-center",
  callbackMessage: "text-body text-ink-muted",
} as const;
