/**
 * True when the row/entity an admin action would target is the acting admin's own account —
 * used to hide self-escalation-guarded actions (role change, status change, delete) rather than
 * let the admin hit the backend's own self-target rejection. Single shared comparison so the
 * coercion rule can't drift between the users list and the user detail page.
 */
export function isSelfAdminTarget(
  targetId: unknown,
  currentUserId: string | undefined | null,
): boolean {
  if (!currentUserId || targetId == null) return false;
  return String(targetId) === currentUserId;
}
