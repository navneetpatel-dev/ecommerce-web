"use client";

import { useState } from "react";
import { SidebarNav } from "@/shared/components/layout/SidebarNav.component";
import { WorkspaceNavDrawer } from "@/shared/components/layout/WorkspaceNavDrawer.component";
import { ShieldCheck } from "lucide-react";
import { useAdminLayout } from "@/shared/hooks/navigation/useAdminLayout.hook";
import { RequirePermission } from "@/shared/components/system/RequirePermission.component";
import { adminPermissionsForPath } from "@/shared/constants/navigation/adminNav";
import { PATHS } from "@/shared/constants/paths/paths";
import { MAIN_CONTENT_ID } from "@/shared/constants/a11y/landmarks";
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

  const closeNav = () => setNavOpen(false);

  // Close the drawer when the route changes (during render — no sync-in-effect).
  const [syncedPathname, setSyncedPathname] = useState(pathname);
  if (pathname !== syncedPathname) {
    setSyncedPathname(pathname);
    setNavOpen(false);
  }

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
          onClose={closeNav}
          items={navItems}
          currentPath={pathname}
          title={LABELS.adminPanel}
        />
        <main id={MAIN_CONTENT_ID} tabIndex={-1} className={styles.main}>
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
