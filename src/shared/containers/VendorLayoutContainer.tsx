"use client";

import { useEffect, useState } from "react";
import { SidebarNav } from "@/shared/components/layout/SidebarNav";
import { WorkspaceNavDrawer } from "@/shared/components/layout/WorkspaceNavDrawer";
import { useVendorLayout } from "@/shared/hooks/useVendorLayout";
import { LABELS } from "@/shared/constants/labels";

export function VendorLayoutContainer({
  children,
  renderHeader,
}: {
  children: React.ReactNode;
  /** Renders the top header; receives the callback that opens the workspace nav drawer. */
  renderHeader: (openWorkspaceNav: () => void) => React.ReactNode;
}) {
  const { pathname, navItems } = useVendorLayout();
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    setNavOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-paper">
      {renderHeader(() => setNavOpen(true))}
      <div className="flex min-w-0">
        <SidebarNav items={navItems} currentPath={pathname} />
        <WorkspaceNavDrawer
          open={navOpen}
          onClose={() => setNavOpen(false)}
          items={navItems}
          currentPath={pathname}
          title={LABELS.vendorDashboard}
        />
        <main className="min-w-0 flex-1 overflow-x-hidden bg-surface p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
