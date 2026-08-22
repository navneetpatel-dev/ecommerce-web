import type { Metadata } from "next";
import { LABELS } from "@/shared/constants/labels";
import { HelpPage } from "@/features/help";
import { SEO_PAGE_COPY } from "@/shared/seo/constants";

export const metadata: Metadata = {
  title: LABELS.helpCenter,
  description: SEO_PAGE_COPY.help.description,
};

export default function HelpRoute() {
  return <HelpPage />;
}
