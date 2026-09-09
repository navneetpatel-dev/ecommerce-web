import { TabsContent } from "@/shared/components/ui/tabs";
import { adminSectionTabsStyles } from "../../../styles/shared/adminSectionTabs.styles";
import type { AdminSectionTabItem } from "../../../types/shared/adminSectionTabs.types";

interface AdminSectionTabPanelsListProps {
  tabs: AdminSectionTabItem[];
}

export function AdminSectionTabPanelsList({
  tabs,
}: AdminSectionTabPanelsListProps) {
  return (
    <>
      {tabs.map((tab) => (
        <TabsContent
          key={tab.value}
          value={tab.value}
          className={adminSectionTabsStyles.tabContent}
        >
          {tab.content}
        </TabsContent>
      ))}
    </>
  );
}
