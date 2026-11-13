const DETAIL_TABS = ["description", "specifications", "reviews", "qna"];

/** The PDP tab to open first: `?tab=reviews` (e.g. from "Write a review") or Description. */
export function initialDetailTab(requested: string | null): string {
  return requested && DETAIL_TABS.includes(requested)
    ? requested
    : "description";
}
