import { TabsTrigger } from "@/shared/components/ui/tabs";
import { LABELS } from "@/shared/constants/labels";
import { adminSectionTabsStyles } from "../../../styles/shared/adminSectionTabs.styles";
import type { AdminSectionTabItem } from "../../../types/shared/adminSectionTabs.types";

interface AdminSectionTabTriggerProps {
  tab: AdminSectionTabItem;
}

export function AdminSectionTabTrigger({ tab }: AdminSectionTabTriggerProps) {
  const hasCount = typeof tab.count === "number" && tab.count > 0;
  const countDisplay =
    tab.count && tab.count > 99 ? LABELS.countOverflow : tab.count;

  return (
    <TabsTrigger
      value={tab.value}
      className={adminSectionTabsStyles.tabTrigger}
    >
      <span>{tab.label}</span>
      {hasCount ? (
        <span
          aria-label={String(tab.count)}
          className={adminSectionTabsStyles.badge}
        >
          {countDisplay}
        </span>
      ) : null}
    </TabsTrigger>
  );
}
