import { VENDOR_GROUP_CARD } from "@/shared/components/vendorGroupStyles";

export const vendorGroupsStyles = {
  container: "space-y-4",
  groupCard: VENDOR_GROUP_CARD,
  header: "mb-1",
  itemsList: "divide-y divide-line",
  footerWrapper: "mt-6 border-t border-line pt-4",
} as const;
