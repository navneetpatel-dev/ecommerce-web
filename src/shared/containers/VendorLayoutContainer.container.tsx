"use client";

import { useEffect, useState } from "react";
import { SidebarNav } from "@/shared/components/layout/SidebarNav.component";
import { WorkspaceNavDrawer } from "@/shared/components/layout/WorkspaceNavDrawer.component";
import { useVendorLayout } from "@/shared/hooks/useVendorLayout.hook";
import { RequirePermission } from "@/shared/components/RequirePermission.component";
import { vendorPermissionsForPath } from "@/shared/constants/vendorNav";
import { PATHS } from "@/shared/constants/paths";
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
          {pathname === PATHS.vendor.root ||
          pathname === PATHS.vendor.profile ? (
            children
          ) : (
            <RequirePermission permission={vendorPermissionsForPath(pathname)}>
              {children}
            </RequirePermission>
          )}
        </main>
      </div>
    </div>
  );
}
