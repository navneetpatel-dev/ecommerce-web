import { NewsletterFormContainer } from "@/shared/containers/forms/NewsletterFormContainer.container";
import { FOOTER_SECTIONS } from "@/shared/constants/navigation/footer";
import { LABELS } from "@/shared/constants/labels";
import { FooterLinksList } from "./FooterLinksList.component";
import {
  FOOTER_DESKTOP_GRID,
  FOOTER_DESKTOP_LIST,
  FOOTER_NEWSLETTER_DESC,
  FOOTER_SECTION_TITLE,
} from "../../../styles/layout/footer.styles";

/** Desktop footer columns — one entry per FOOTER_SECTIONS item. */
export function FooterDesktopSections() {
  return (
    <div className={FOOTER_DESKTOP_GRID}>
      {FOOTER_SECTIONS.map((section) =>
        "isNewsletter" in section && section.isNewsletter ? (
          <div key={section.title}>
            <h4 className={FOOTER_SECTION_TITLE}>{LABELS.newsletter}</h4>
            <p className={FOOTER_NEWSLETTER_DESC}>
              {LABELS.newsletterDescription}
            </p>
            <NewsletterFormContainer idPrefix="desktop" />
          </div>
        ) : (
          <div key={section.title}>
            <h4 className={FOOTER_SECTION_TITLE}>{section.title}</h4>
            <FooterLinksList
              links={section.links}
              className={FOOTER_DESKTOP_LIST}
            />
          </div>
        ),
      )}
    </div>
  );
}
