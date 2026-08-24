"use client";

import { AdminLayout } from "@/shared/components/layout/AdminLayout.component";
import { HeaderContainer } from "@/features/storefront";

export default function AdminRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminLayout
      renderHeader={(openWorkspaceNav) => (
        <HeaderContainer
          showStorefrontChrome={false}
          showWorkspaceMenu
          onOpenWorkspaceNav={openWorkspaceNav}
        />
      )}
    >
      {children}
    </AdminLayout>
  );
}
