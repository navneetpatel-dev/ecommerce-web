import { Badge } from "@/shared/components/ui/badge";
import type { DataTableColumn } from "@/shared/components/DataTable";
import { LABELS } from "@/shared/constants/labels";
import { formatOrderDate } from "@/shared/utils/formatting/orderFormat";
import type { StaffMember } from "../../../api/vendorStaff.api";
import { vendorTeamStyles as styles } from "../../../styles/team/vendorTeam.styles";
import { StaffMemberName } from "./StaffMemberName.component";

export const staffMemberColumns: DataTableColumn<StaffMember>[] = [
  {
    id: "name",
    header: LABELS.name,
    truncate: false,
    cell: (member) => <StaffMemberName member={member} />,
  },
  {
    id: "email",
    header: LABELS.staffEmail,
    cell: (member) => <span className={styles.email}>{member.email}</span>,
  },
  {
    id: "role",
    header: LABELS.role,
    truncate: false,
    cell: (member) => (
      <Badge variant={member.isOwner ? "default" : "outline"}>
        {member.isOwner ? LABELS.staffPrimaryOwner : LABELS.staffRole}
      </Badge>
    ),
  },
  {
    id: "joined",
    header: LABELS.staffJoined,
    cell: (member) => formatOrderDate(member.createdAt),
  },
];
