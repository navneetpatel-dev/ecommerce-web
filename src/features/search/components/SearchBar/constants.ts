import { SEARCH_SUGGESTION_TYPE } from "../../constants";

export const SEARCH_LIST_ID = "search-suggestions-list";

export const panelTransition = {
  height: { duration: 0.26, ease: [0.16, 1, 0.3, 1] as const },
  opacity: { duration: 0.2, ease: "easeOut" as const },
};

export const SECTION_ORDER = [
  SEARCH_SUGGESTION_TYPE.PRODUCT,
  SEARCH_SUGGESTION_TYPE.CATEGORY,
  SEARCH_SUGGESTION_TYPE.VENDOR,
] as const;
