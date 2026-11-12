"use client";

import { MaintenanceView } from "../../components/maintenance/MaintenanceView.component";
import { useMaintenancePage } from "../../hooks/maintenance/useMaintenancePage.hook";

export function MaintenancePage() {
  const { message, backBy } = useMaintenancePage();
  return <MaintenanceView message={message} backBy={backBy} />;
}
