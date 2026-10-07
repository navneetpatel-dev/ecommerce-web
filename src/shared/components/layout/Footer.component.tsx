"use client";

import { FooterDesktopSections } from "./Footer/FooterDesktopSections.component";
import { FooterMobileSections } from "./Footer/FooterMobileSections.component";
import { FooterPaymentMethods } from "./Footer/FooterPaymentMethods.component";
import { LABELS } from "@/shared/constants/labels";
import {
  FOOTER_BOTTOM_BAR,
  FOOTER_BOTTOM_ROW,
  FOOTER_COPYRIGHT,
  FOOTER_PAYMENT_METHODS,
  FOOTER_ROOT,
} from "../../styles/layout/footer.styles";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={FOOTER_ROOT}>
      <FooterDesktopSections />

      <FooterMobileSections />

      <div className={FOOTER_BOTTOM_BAR}>
        <div className={FOOTER_BOTTOM_ROW}>
          {/* Year renders at request time on both sides — suppress the
              year-boundary hydration diff rather than blanking the line. */}
          <p className={FOOTER_COPYRIGHT} suppressHydrationWarning>
            {LABELS.brandName} &copy; {currentYear}
          </p>
          <FooterPaymentMethods className={FOOTER_PAYMENT_METHODS} />
        </div>
      </div>
    </footer>
  );
}
