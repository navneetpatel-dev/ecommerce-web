"use client";

import { PATHS } from "@/shared/constants/paths/paths";
import { CreateTicketForm } from "../../components/form/CreateTicketForm.component";
import { supportTicketsPagesStyles } from "../customer/supportTicketsPages.styles";
import { RequirePermission } from "@/shared/components/system/RequirePermission.component";
import { VENDOR_SUPPORT_ACCESS } from "@/shared/constants/permissions/permissions";

export function VendorNewTicketPage() {
  return (
    <RequirePermission permission={VENDOR_SUPPORT_ACCESS}>
      <div className={supportTicketsPagesStyles.customerNewTicketContainer}>
        <CreateTicketForm successHref={PATHS.vendor.supportTicket} />
      </div>
    </RequirePermission>
  );
}
