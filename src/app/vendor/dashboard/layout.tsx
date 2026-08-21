"use client";

import { VendorLayout } from "@/shared/components/layout/VendorLayout";
import { HeaderContainer } from "@/features/storefront";

export default function VendorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <VendorLayout
      renderHeader={(openWorkspaceNav) => (
        <HeaderContainer
          showStorefrontChrome={false}
          showWorkspaceMenu
          onOpenWorkspaceNav={openWorkspaceNav}
        />
      )}
    >
      {children}
    </VendorLayout>
  );
}
