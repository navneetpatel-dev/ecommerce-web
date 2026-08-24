import type { HelpCategory } from "../../types/help.types";
import { GETTING_STARTED_ONBOARDING_ARTICLES } from "./getting-started-onboarding";
import { GETTING_STARTED_SHOPPING_ARTICLES } from "./getting-started-shopping";

export const GETTING_STARTED_CATEGORY: HelpCategory = {
  id: "getting-started",
  title: "Getting started",
  description:
    "Create an account, browse sellers, and place your first order on Ink & Brass.",
  icon: "BookOpen",
  articles: [
    ...GETTING_STARTED_ONBOARDING_ARTICLES,
    ...GETTING_STARTED_SHOPPING_ARTICLES,
  ],
};
