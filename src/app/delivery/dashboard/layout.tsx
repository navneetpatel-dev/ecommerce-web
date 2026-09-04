"use client";

import { DeliveryLayout } from "@/shared/components/layout/DeliveryLayout.component";
import { HeaderContainer } from "@/features/storefront";
import { OfflineSyncBanner } from "@/features/delivery-dashboard";

export default function DeliveryDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DeliveryLayout
      renderHeader={(openWorkspaceNav) => (
        <HeaderContainer
          showStorefrontChrome={false}
          showWorkspaceMenu
          onOpenWorkspaceNav={openWorkspaceNav}
        />
      )}
    >
      <OfflineSyncBanner />
      {children}
    </DeliveryLayout>
  );
}
