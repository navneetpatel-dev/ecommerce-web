/**
 * Public query surface for bug reports. Split by responsibility
 * (keys / reads / writes) under Rule 3; consumers keep this single import.
 */
export { bugReportKeys, useBugQueryEnabled } from "./bugReports.keys";

export {
  useMyBugReportsInfinite,
  useAdminBugReportsInfinite,
  useBugReport,
  useBugCommentsInfinite,
  useCreateBugReport,
} from "./bugReports.list.queries";

export {
  useTriageBugReport,
  useUpdateBugAssignment,
  useUpdateBugStatus,
  useMarkBugDuplicate,
  useWontFixBug,
  useVerifyBug,
  useAddBugComment,
} from "../detail/bugReports.mutations";
