"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/shared/components/ui/accordion";
import { NewsletterFormContainer } from "@/shared/containers/NewsletterFormContainer.container";
import { FOOTER_SECTIONS } from "@/shared/constants/footer";
import { FooterLinksList } from "./Footer/FooterLinksList.component";
import {
  FOOTER_BOTTOM_BAR,
  FOOTER_BOTTOM_ROW,
  FOOTER_COPYRIGHT,
  FOOTER_DESKTOP_GRID,
  FOOTER_DESKTOP_LIST,
  FOOTER_MOBILE_CONTAINER,
  FOOTER_MOBILE_LIST,
  FOOTER_MOBILE_NEWSLETTER_BOX,
  FOOTER_MOBILE_NEWSLETTER_TITLE,
  FOOTER_NEWSLETTER_DESC,
  FOOTER_PAYMENT_METHODS,
  FOOTER_ROOT,
  FOOTER_SECTION_TITLE,
} from "./Footer/footer.styles";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={FOOTER_ROOT}>
      <div className={FOOTER_DESKTOP_GRID}>
        {FOOTER_SECTIONS.map((section) => (
          <div key={section.title}>
            {!("isNewsletter" in section && section.isNewsletter) ? (
              <>
                <h4 className={FOOTER_SECTION_TITLE}>{section.title}</h4>
                <FooterLinksList
                  links={section.links}
                  className={FOOTER_DESKTOP_LIST}
                />
              </>
            ) : (
              <div>
                <h4 className={FOOTER_SECTION_TITLE}>Newsletter</h4>
                <p className={FOOTER_NEWSLETTER_DESC}>
                  Get the latest deals and new arrivals.
                </p>
                <NewsletterFormContainer idPrefix="desktop" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className={FOOTER_MOBILE_CONTAINER}>
        <Accordion type="single" collapsible>
          {FOOTER_SECTIONS.map((section) =>
            !("isNewsletter" in section && section.isNewsletter) ? (
              <AccordionItem key={section.title} value={section.title}>
                <AccordionTrigger>{section.title}</AccordionTrigger>
                <AccordionContent>
                  <FooterLinksList
                    links={section.links}
                    className={FOOTER_MOBILE_LIST}
                  />
                </AccordionContent>
              </AccordionItem>
            ) : null,
          )}
        </Accordion>
        <div className={FOOTER_MOBILE_NEWSLETTER_BOX}>
          <h4 className={FOOTER_MOBILE_NEWSLETTER_TITLE}>Newsletter</h4>
          <NewsletterFormContainer idPrefix="mobile" />
        </div>
      </div>

      <div className={FOOTER_BOTTOM_BAR}>
        <div className={FOOTER_BOTTOM_ROW}>
          <p className={FOOTER_COPYRIGHT}>Marketplace &copy; {currentYear}</p>
          <div className={FOOTER_PAYMENT_METHODS}>
            <span>Visa</span>
            <span>Mastercard</span>
            <span>UPI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
