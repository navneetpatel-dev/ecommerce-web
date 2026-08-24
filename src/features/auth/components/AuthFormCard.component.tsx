import type { ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

interface AuthFormCardProps {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

/** Shared surface for login / register / password / OTP forms. */
export function AuthFormCard({
  title,
  description,
  children,
  footer,
  className,
}: AuthFormCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-line/90 bg-surface/95 shadow-elevation-3 ring-1 ring-inset ring-white/[0.04] backdrop-blur-sm",
        className,
      )}
    >
      <header className="space-y-1.5 border-b border-line/80 bg-gradient-to-b from-paper/55 to-paper/25 px-5 py-5 sm:space-y-2 sm:px-8 sm:py-8">
        <h1 className="font-display text-[1.5rem] font-semibold leading-tight tracking-tight text-ink sm:text-[2rem]">
          {title}
        </h1>
        <p className="max-w-prose text-[0.875rem] leading-relaxed text-ink-muted sm:text-[1rem]">
          {description}
        </p>
      </header>
      <div className="space-y-5 px-5 py-5 sm:space-y-6 sm:px-8 sm:py-8">
        {children}
      </div>
      {footer ? (
        <footer className="border-t border-line/80 bg-paper/30 px-5 py-4 sm:px-8 sm:py-5">
          {footer}
        </footer>
      ) : null}
    </div>
  );
}
