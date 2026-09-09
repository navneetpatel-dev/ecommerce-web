import { TabsList } from "@/shared/components/ui/tabs";
import { adminSectionTabsStyles } from "./adminSectionTabs.styles";
import { AdminSectionTabTrigger } from "./AdminSectionTabTrigger.component";
import type { AdminSectionTabItem } from "./adminSectionTabs.types";

interface AdminSectionTabTriggersListProps {
  tabs: AdminSectionTabItem[];
}

export function AdminSectionTabTriggersList({
  tabs,
}: AdminSectionTabTriggersListProps) {
  return (
    <TabsList className={adminSectionTabsStyles.tabsList}>
      {tabs.map((tab) => (
        <AdminSectionTabTrigger key={tab.value} tab={tab} />
      ))}
    </TabsList>
  );
}
