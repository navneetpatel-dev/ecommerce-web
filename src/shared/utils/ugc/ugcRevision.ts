/**
 * An edit of approved / published text waits for moderation while shoppers keep
 * seeing the approved version. The author, though, sees what they last wrote —
 * with a note — and a note again if that edit was turned down.
 */
export type RevisionState = "pending" | "declined" | null;

export function revisionState(item: {
  pendingRevision?: unknown;
  revisionRejectedAt?: string | null;
}): RevisionState {
  if (item.pendingRevision) return "pending";
  return item.revisionRejectedAt ? "declined" : null;
}

/** The item as its author sees it: their waiting edit laid over the live version. */
export function asAuthorSees<T extends { pendingRevision?: object | null }>(
  item: T,
): T {
  if (!item.pendingRevision) return item;
  const { submittedAt: _submittedAt, ...edit } = item.pendingRevision as Record<
    string,
    unknown
  >;
  return { ...item, ...edit };
}
