import type { ReactNode } from "react";
import type { PermissionKey } from "@/shared/constants/permissions";
import type {
  AdminDataRow,
  AdminListLoadFn,
} from "../hooks/useAdminDataList.hook";

/** Shared shape returned by admin list-page hooks. */
export type AdminListPageModel = {
  title: string;
  permission: PermissionKey | PermissionKey[];
  load: AdminListLoadFn;
  actions?: (row: AdminDataRow, reload: () => void) => ReactNode;
  columnKeys?: string[];
};
