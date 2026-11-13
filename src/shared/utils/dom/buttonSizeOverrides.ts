/**
 * Button sizes step up from `sm` (`px-4 text-[0.875rem] sm:px-5 sm:text-body`).
 * A caller that sets its own padding or font size (`px-0`, `text-body-sm`) means
 * it at every width — but tailwind-merge keeps the `sm:` classes, so from 640px
 * up the caller's value silently lost: text links grew a 20px indent and 15px
 * text. This drops the size's `sm:` step for whichever of the two the caller set
 * without a breakpoint (a caller's own `sm:px-*` / `sm:text-*` still wins).
 */
const CALLER_PADDING_X = /(?:^|\s)(?:px|pl|pr|ps|pe)-/;
const CALLER_SM_PADDING_X = /(?:^|\s)sm:(?:px|pl|pr|ps|pe)-/;
const CALLER_FONT_SIZE =
  /(?:^|\s)text-(?:\[\d|body|label|mono|display|xs\b|sm\b|base\b|lg\b|[2-9]?xl\b)/;
const CALLER_SM_FONT_SIZE = /(?:^|\s)sm:text-/;

export function dropSizeStepsOverridden(
  sizeClasses: string,
  callerClassName: string | undefined,
): string {
  if (!callerClassName) return sizeClasses;
  let classes = sizeClasses;
  if (
    CALLER_PADDING_X.test(callerClassName) &&
    !CALLER_SM_PADDING_X.test(callerClassName)
  ) {
    classes = classes.replace(/(?:^|\s)sm:px-\S+/g, "");
  }
  if (
    CALLER_FONT_SIZE.test(callerClassName) &&
    !CALLER_SM_FONT_SIZE.test(callerClassName)
  ) {
    classes = classes.replace(/(?:^|\s)sm:text-body(?=\s|$)/g, "");
  }
  return classes;
}
