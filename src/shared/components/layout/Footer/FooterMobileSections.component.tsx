import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/shared/components/ui/accordion";
import { NewsletterFormContainer } from "@/shared/containers/forms/NewsletterFormContainer.container";
import { FOOTER_SECTIONS } from "@/shared/constants/navigation/footer";
import { LABELS } from "@/shared/constants/labels";
import { FooterLinksList } from "./FooterLinksList.component";
import {
  FOOTER_MOBILE_CONTAINER,
  FOOTER_MOBILE_LIST,
  FOOTER_MOBILE_NEWSLETTER_BOX,
  FOOTER_MOBILE_NEWSLETTER_TITLE,
} from "../../../styles/layout/footer.styles";

/** Mobile footer — collapsible section list plus the newsletter signup box. */
export function FooterMobileSections() {
  return (
    <div className={FOOTER_MOBILE_CONTAINER}>
      <Accordion type="single" collapsible>
        {FOOTER_SECTIONS.map((section) =>
          "isNewsletter" in section && section.isNewsletter ? null : (
            <AccordionItem key={section.title} value={section.title}>
              <AccordionTrigger>{section.title}</AccordionTrigger>
              <AccordionContent>
                <FooterLinksList
                  links={section.links}
                  className={FOOTER_MOBILE_LIST}
                />
              </AccordionContent>
            </AccordionItem>
          ),
        )}
      </Accordion>
      <div className={FOOTER_MOBILE_NEWSLETTER_BOX}>
        <h4 className={FOOTER_MOBILE_NEWSLETTER_TITLE}>{LABELS.newsletter}</h4>
        <NewsletterFormContainer idPrefix="mobile" />
      </div>
    </div>
  );
}
