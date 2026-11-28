import { PRODUCT_STATUS } from "@/shared/constants/statuses";

/**
 * A listing on sale, or waiting to be approved, keeps its last variant and its last image (the
 * API refuses to remove them): whether removing one of `count` is therefore not offered.
 */
export function keepsLastItem(
  status: string | null | undefined,
  count: number,
): boolean {
  const published =
    status === PRODUCT_STATUS.LIVE ||
    status === PRODUCT_STATUS.PENDING_APPROVAL;
  return published && count <= 1;
}
