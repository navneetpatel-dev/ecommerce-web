"use client";

import { Tabs } from "@/shared/components/ui/tabs";
import { adminSectionTabsStyles } from "./adminSectionTabs.styles";
import { AdminSectionTabTriggersList } from "./AdminSectionTabTriggersList.component";
import { AdminSectionTabPanelsList } from "./AdminSectionTabPanelsList.component";
import type { AdminSectionTabItem } from "./adminSectionTabs.types";

export type { AdminSectionTabItem };

export interface AdminSectionTabsProps {
  title: string;
  description?: string;
  defaultValue: string;
  tabs: AdminSectionTabItem[];
  className?: string;
}

/** Segmented tab shell for admin list + queue screens (one panel visible at a time). */
export function AdminSectionTabs({
  title,
  description,
  defaultValue,
  tabs,
  className,
}: AdminSectionTabsProps) {
  return (
    <div className={adminSectionTabsStyles.root(className)}>
      <header className={adminSectionTabsStyles.header}>
        <h1 className={adminSectionTabsStyles.title}>{title}</h1>
        {description ? (
          <p className={adminSectionTabsStyles.description}>{description}</p>
        ) : null}
      </header>

      <Tabs
        defaultValue={defaultValue}
        className={adminSectionTabsStyles.tabsRoot}
      >
        <AdminSectionTabTriggersList tabs={tabs} />
        <AdminSectionTabPanelsList tabs={tabs} />
      </Tabs>
    </div>
  );
}
