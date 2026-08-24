"use client";

import Link from "next/link";
import { UserRound } from "lucide-react";
import { EmptyState } from "@/shared/components/EmptyState.component";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths";
import { useAuthStore } from "@/shared/stores/auth.store";
import { useIsAuthenticated } from "@/shared/hooks/useRequireAuth.hook";

type Props = {
  message: string;
  loginNext: string;
  children: React.ReactNode;
};

export function SupportAuthGate({ message, loginNext, children }: Props) {
  const authBootstrapped = useAuthStore((s) => s.authBootstrapped);
  const isAuthenticated = useIsAuthenticated();

  if (!authBootstrapped) {
    return (
      <div className="storefront-container space-y-3 py-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="storefront-container py-16 md:py-20">
        <EmptyState
          icon={UserRound}
          heading={LABELS.logIn}
          message={message}
          actionLabel={LABELS.logIn}
          actionTo={PATHS.loginWithRedirect(loginNext)}
        />
        <div className="mt-4 flex justify-center">
          <Button variant="ghost" asChild>
            <Link href={PATHS.register}>{LABELS.createAccount}</Link>
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
