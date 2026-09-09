"use client";

import { useState } from "react";
import { SidebarNav } from "@/shared/components/layout/SidebarNav.component";
import { WorkspaceNavDrawer } from "@/shared/components/layout/WorkspaceNavDrawer.component";
import { useDeliveryLayout } from "@/shared/hooks/navigation/useDeliveryLayout.hook";
import { RequirePermission } from "@/shared/components/RequirePermission.component";
import { deliveryPermissionsForPath } from "@/shared/constants/navigation/deliveryNav";
import { PATHS } from "@/shared/constants/paths/paths";
import { LABELS } from "@/shared/constants/labels";
import { workspaceLayoutStyles as styles } from "./workspaceLayout.styles";

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
    <div className={styles.root}>
      {renderHeader(() => setNavOpen(true))}
      <div className={styles.bodyFlex}>
        <SidebarNav items={navItems} currentPath={pathname} />
        <WorkspaceNavDrawer
          open={navOpen}
          onClose={() => setNavOpen(false)}
          items={navItems}
          currentPath={pathname}
          title={LABELS.deliveryDashboard}
        />
        <main className={styles.deliveryMain}>
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
