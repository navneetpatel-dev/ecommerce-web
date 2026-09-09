import type { HelpCategory } from "../../types/help/help.types";
import { RETURNS_REFUNDS_REQUESTS_ARTICLES } from "./returns-refunds-requests";
import { RETURNS_REFUNDS_OUTCOMES_ARTICLES } from "./returns-refunds-outcomes";

export const RETURNS_REFUNDS_CATEGORY: HelpCategory = {
  id: "returns-refunds",
  title: "Returns & refunds",
  description:
    "Item-level returns, eligibility windows, refund routes, and My Returns status.",
  icon: "RotateCcw",
  articles: [
    ...RETURNS_REFUNDS_REQUESTS_ARTICLES,
    ...RETURNS_REFUNDS_OUTCOMES_ARTICLES,
  ],
};
