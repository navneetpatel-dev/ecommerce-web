"use client";

import { useState } from "react";
import { SidebarNav } from "@/shared/components/layout/SidebarNav.component";
import { WorkspaceNavDrawer } from "@/shared/components/layout/WorkspaceNavDrawer.component";
import { useDeliveryLayout } from "@/shared/hooks/useDeliveryLayout.hook";
import { RequirePermission } from "@/shared/components/RequirePermission.component";
import { deliveryPermissionsForPath } from "@/shared/constants/deliveryNav";
import { PATHS } from "@/shared/constants/paths";
import { LABELS } from "@/shared/constants/labels";

export function DeliveryLayoutContainer({
  children,
  renderHeader,
}: {
  children: React.ReactNode;
  renderHeader: (openWorkspaceNav: () => void) => React.ReactNode;
}) {
  const { pathname, navItems } = useDeliveryLayout();
  const [navOpen, setNavOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setNavOpen(false);
  }

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
          title={LABELS.deliveryDashboard}
        />
        <main className="min-w-0 flex-1 overflow-x-hidden bg-surface p-4 pb-20 sm:p-6 sm:pb-8 lg:p-8">
          {pathname === PATHS.delivery.root ||
          pathname === PATHS.delivery.profile ? (
            children
          ) : (
            <RequirePermission
              permission={deliveryPermissionsForPath(pathname)}
            >
              {children}
            </RequirePermission>
          )}
        </main>
      </div>
    </div>
  );
}
