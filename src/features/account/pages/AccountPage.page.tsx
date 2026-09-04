"use client";

import Link from "next/link";
import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { UserRound } from "lucide-react";
import { EmptyState } from "@/shared/components/EmptyState.component";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { PATHS } from "@/shared/constants/paths";
import { LABELS } from "@/shared/constants/labels";
import { isWorkspaceProfilePath } from "@/shared/utils/profilePaths";
import { AccountLayout } from "../components/AccountLayout.component";
import { OverviewSection } from "../components/sections/OverviewSection.component";
import { PersonalInfoSection } from "../components/sections/PersonalInfoSection.component";
import { DeliveryOperationsSection } from "../components/sections/DeliveryOperationsSection";
import { SecuritySection } from "../components/sections/SecuritySection.component";
import { AddressesSection } from "../components/sections/AddressesSection.component";
import { OrdersActivitySection } from "../components/sections/OrdersActivitySection.component";
import { PrivacySection } from "../components/sections/PrivacySection.component";
import { useAccountPage } from "../hooks/useAccountPage.hook";
import type { AccountSectionId } from "../types";

function AccountSectionBody({
  section,
  onNavigate,
}: {
  section: AccountSectionId;
  onNavigate: (id: AccountSectionId) => void;
}) {
  switch (section) {
    case "overview":
      return <OverviewSection onNavigate={onNavigate} />;
    case "personal":
      return <PersonalInfoSection />;
    case "operations":
      return <DeliveryOperationsSection />;
    case "security":
      return <SecuritySection />;
    case "addresses":
      return <AddressesSection />;
    case "orders":
      return <OrdersActivitySection />;
    case "privacy":
      return <PrivacySection />;
    default:
      return <OverviewSection onNavigate={onNavigate} />;
  }
}

function AccountPageInner() {
  const pathname = usePathname();
  const {
    isAuthenticated,
    authBootstrapped,
    sections,
    activeSection,
    setSection,
  } = useAccountPage();

  if (!authBootstrapped) {
    return <AccountPageFallback />;
  }

  if (!isAuthenticated) {
    const loginNext = isWorkspaceProfilePath(pathname)
      ? pathname
      : PATHS.profile;
    return (
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_color-mix(in_srgb,var(--brand)_12%,transparent),transparent_55%)]"
        />
        <div className="storefront-container relative py-16 md:py-20">
          <EmptyState
            icon={UserRound}
            heading="Sign in to manage your account"
            message="Access profile settings and preferences after you log in."
            actionLabel={LABELS.logIn}
            actionTo={PATHS.loginWithRedirect(loginNext)}
          />
          <div className="mt-4 flex justify-center">
            <Button variant="ghost" asChild>
              <Link href={PATHS.register}>Create an account</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (sections.length === 0) {
    return <AccountPageFallback />;
  }

  return (
    <AccountLayout
      sections={sections}
      activeSection={activeSection}
      onSectionChange={setSection}
    >
      <AccountSectionBody section={activeSection} onNavigate={setSection} />
    </AccountLayout>
  );
}

function AccountPageFallback() {
  return (
    <div className="storefront-container space-y-4 py-8">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-10 w-48" />
      <Skeleton className="mt-6 h-64 w-full" />
    </div>
  );
}

export function AccountPage() {
  return (
    <Suspense fallback={<AccountPageFallback />}>
      <AccountPageInner />
    </Suspense>
  );
}
