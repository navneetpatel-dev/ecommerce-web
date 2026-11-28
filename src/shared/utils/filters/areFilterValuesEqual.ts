/** Whether two sets of filter values show the same rows (blank ones are ignored). */
export function areFilterValuesEqual(
  a: Record<string, unknown>,
  b: Record<string, unknown>,
): boolean {
  const keysA = Object.keys(a).filter(
    (k) => a[k] !== "" && a[k] !== undefined && a[k] !== null,
  );
  const keysB = Object.keys(b).filter(
    (k) => b[k] !== "" && b[k] !== undefined && b[k] !== null,
  );

  if (keysA.length !== keysB.length) return false;
  return keysA.every((k) => String(a[k]) === String(b[k]));
}
