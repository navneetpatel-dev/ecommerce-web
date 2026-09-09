import { TabsList } from "@/shared/components/ui/tabs";
import { adminSectionTabsStyles } from "../../../styles/shared/adminSectionTabs.styles";
import { AdminSectionTabTrigger } from "./AdminSectionTabTrigger.component";
import type { AdminSectionTabItem } from "../../../types/shared/adminSectionTabs.types";

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
