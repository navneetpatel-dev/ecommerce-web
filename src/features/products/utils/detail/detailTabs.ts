/** The PDP's tabs, in order; the first is the default (kept out of the URL). */
export const DETAIL_TABS = [
  "description",
  "specifications",
  "reviews",
  "qna",
] as const;
export type DetailTab = (typeof DETAIL_TABS)[number];
