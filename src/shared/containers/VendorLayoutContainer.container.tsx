"use client";

import { useEffect, useState } from "react";
import { SidebarNav } from "@/shared/components/layout/SidebarNav.component";
import { WorkspaceNavDrawer } from "@/shared/components/layout/WorkspaceNavDrawer.component";
import { useVendorLayout } from "@/shared/hooks/useVendorLayout.hook";
import { RequirePermission } from "@/shared/components/RequirePermission.component";
import { vendorPermissionsForPath } from "@/shared/constants/vendorNav";
import { PATHS } from "@/shared/constants/paths";
import { LABELS } from "@/shared/constants/labels";
import { workspaceLayoutStyles as styles } from "./workspaceLayout.styles";

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
    <div className={styles.root}>
      {renderHeader(() => setNavOpen(true))}
      <div className={styles.bodyFlex}>
        <SidebarNav items={navItems} currentPath={pathname} />
        <WorkspaceNavDrawer
          open={navOpen}
          onClose={() => setNavOpen(false)}
          items={navItems}
          currentPath={pathname}
          title={LABELS.vendorDashboard}
        />
        <main className={styles.main}>
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
