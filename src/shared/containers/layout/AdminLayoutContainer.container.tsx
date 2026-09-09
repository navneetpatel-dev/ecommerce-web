"use client";

import { useEffect, useState } from "react";
import { SidebarNav } from "@/shared/components/layout/SidebarNav.component";
import { WorkspaceNavDrawer } from "@/shared/components/layout/WorkspaceNavDrawer.component";
import { ShieldCheck } from "lucide-react";
import { useAdminLayout } from "@/shared/hooks/navigation/useAdminLayout.hook";
import { RequirePermission } from "@/shared/components/RequirePermission.component";
import { adminPermissionsForPath } from "@/shared/constants/navigation/adminNav";
import { PATHS } from "@/shared/constants/paths/paths";
import { LABELS } from "@/shared/constants/labels";
import { workspaceLayoutStyles as styles } from "./workspaceLayout.styles";

export function AdminLayoutContainer({
  children,
  renderHeader,
}: {
  children: React.ReactNode;
  /** Renders the top header; receives the callback that opens the workspace nav drawer. */
  renderHeader: (openWorkspaceNav: () => void) => React.ReactNode;
}) {
  const { pathname, navItems } = useAdminLayout();
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    setNavOpen(false);
  }, [pathname]);

  const sidebarHeader = (
    <div className={styles.adminSidebarHeader}>
      <ShieldCheck className={styles.adminSidebarIcon} />
      <span className={styles.adminSidebarTitle}>{LABELS.adminPanel}</span>
    </div>
  );

  return (
    <div className={styles.root}>
      {renderHeader(() => setNavOpen(true))}
      <div className={styles.bodyFlex}>
        <SidebarNav
          items={navItems}
          currentPath={pathname}
          header={sidebarHeader}
        />
        <WorkspaceNavDrawer
          open={navOpen}
          onClose={() => setNavOpen(false)}
          items={navItems}
          currentPath={pathname}
          title={LABELS.adminPanel}
        />
        <main className={styles.main}>
          {pathname === PATHS.admin.root || pathname === PATHS.admin.profile ? (
            children
          ) : (
            <RequirePermission permission={adminPermissionsForPath(pathname)}>
              {children}
            </RequirePermission>
          )}
        </main>
      </div>
    </div>
  );
}
