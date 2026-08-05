export function OAuthButton({ provider }: { provider: string }) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

  return (
    <a
      href={`${apiUrl}/api/auth/${provider}`}
      className="w-full inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-line bg-surface px-4 py-2 text-[0.9375rem] font-medium hover:bg-paper transition-colors"
    >
      Continue with {provider === 'google' ? 'Google' : provider}
    </a>
  )
}
