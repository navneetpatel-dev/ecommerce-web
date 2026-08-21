import type { Metadata } from "next";
import { LABELS } from "@/shared/constants/labels";
import { HelpPage } from "@/features/help";

export const metadata: Metadata = {
  title: LABELS.helpCenter,
  description:
    "Guides for orders, shipping, returns, payments, and your account on our marketplace.",
};

export default function HelpRoute() {
  return <HelpPage />;
}
