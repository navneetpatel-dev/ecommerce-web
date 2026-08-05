export function AuthPageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-paper p-4">
      {children}
    </div>
  )
}
