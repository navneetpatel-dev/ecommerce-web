import { AuthPageShell } from "@/features/auth/components/AuthPageShell.component";
import { Skeleton } from "@/shared/components/ui/skeleton";

/** Form-slot skeleton for login/register/password/OTP route transitions. */
export function AuthFormSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-line/90 bg-surface/95 shadow-elevation-3 ring-1 ring-inset ring-white/[0.04] backdrop-blur-sm">
      <header className="space-y-3 border-b border-line/80 bg-gradient-to-b from-paper/55 to-paper/25 px-5 py-5 sm:px-8 sm:py-8">
        <Skeleton className="h-8 w-48 sm:h-9 sm:w-56" />
        <Skeleton className="h-4 w-full max-w-[16rem]" />
      </header>
      <div className="space-y-5 px-5 py-5 sm:px-8 sm:py-8">
        <div className="space-y-2">
          <Skeleton className="h-3.5 w-16" />
          <Skeleton className="h-11 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3.5 w-20" />
          <Skeleton className="h-11 w-full" />
        </div>
        <Skeleton className="h-11 w-full" />
        <div className="flex items-center gap-3 pt-1">
          <Skeleton className="h-px flex-1" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-px flex-1" />
        </div>
        <Skeleton className="h-11 w-full" />
      </div>
      <footer className="border-t border-line/80 bg-paper/30 px-5 py-4 sm:px-8 sm:py-5">
        <Skeleton className="mx-auto h-4 w-48" />
      </footer>
    </div>
  );
}

/** Full auth page loading state — brand shell stays; skeleton replaces the form. */
export function AuthPageSkeleton() {
  return (
    <AuthPageShell>
      <AuthFormSkeleton />
    </AuthPageShell>
  );
}
