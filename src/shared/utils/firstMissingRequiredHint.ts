/**
 * Returns the first failing required-field message (one-by-one), matching
 * DisabledActionHint usage in admin/vendor forms.
 */
export type RequiredFieldCheck = {
  ok: boolean
  message: string
}

export function firstMissingRequiredHint(
  checks: ReadonlyArray<RequiredFieldCheck>,
): string | undefined {
  for (const check of checks) {
    if (!check.ok) return check.message
  }
  return undefined
}

export function allRequiredFieldsMet(checks: ReadonlyArray<RequiredFieldCheck>): boolean {
  return checks.every((check) => check.ok)
}
