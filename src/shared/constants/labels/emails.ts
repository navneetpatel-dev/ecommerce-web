/** Copy for the email-related pages: newsletter confirmation, the contact form, the email templates admin. */
export const emailLabels = {
  newsletterConfirmHeading: "Confirm your subscription",
  newsletterConfirmBody:
    "One last step: confirm that you want offers and new arrivals from us by email.",
  newsletterConfirmButton: "Yes, subscribe me",
  newsletterConfirmationNotSent:
    "We saved your email but couldn't send the confirmation message. Please try again in a moment.",
  newsletterConfirmedHeading: "You're subscribed",
  newsletterConfirmedBody:
    "Thanks for confirming. We've sent you a welcome email — you can unsubscribe from any message.",
  newsletterConfirmInvalid:
    "This confirmation link is missing or has expired. Sign up again from the footer to get a new one.",
  newsletterConfirmFailed:
    "We couldn't confirm your subscription. Try the link again.",
  newsletterBackToStore: "Back to the store",

  contactFormTitle: "Send us a message",
  contactFormHint:
    "No account needed. We reply to the email address you give us.",
  contactFormName: "Your name",
  contactFormEmail: "Email address",
  contactFormTopic: "What is this about?",
  contactFormTopicPlaceholder: "Choose a topic",
  contactFormSubject: "Subject",
  contactFormMessage: "Message",
  contactFormSubmit: "Send message",
  contactFormNameRequired: "Enter your name",
  contactFormEmailInvalid: "Enter a valid email address",
  contactFormTopicRequired: "Choose a topic",
  contactFormSubjectShort: "Enter a subject (at least 3 characters)",
  contactFormMessageShort: "Tell us a little more (at least 10 characters)",
  contactFormFailed: "We couldn't send your message. Please try again.",
  contactSentHeading: "Message sent",
  contactSentBody:
    "Thanks — we've emailed you a confirmation. Quote this reference if you write to us again:",
  contactSentAnother: "Send another message",

  emailTemplatesTitle: "Email templates",
  emailTemplatesHint:
    "Every email the platform sends, as a recipient sees it. Preview with sample data, in light or dark, and send yourself a test.",
  emailTemplatesOpen: "Email templates",
  emailTemplatesLoadFailed: "Could not load the email templates.",
  emailTemplatesSelectPrompt: "Select a template to preview it.",
  emailTemplatesPreviewFailed: "Could not render this preview.",
  emailTemplatesLight: "Light",
  emailTemplatesDark: "Dark",
  emailTemplatesSendTest: "Send test to me",
  emailTemplatesTestSent: "Test email queued for {email}.",
  emailTemplatesTestFailed: "Could not send the test email.",
  emailTemplatesSubject: "Subject",
  emailTemplatesMarketing: "Marketing",
  emailTemplatesAudienceCustomer: "Customer",
  emailTemplatesAudienceVendor: "Seller",
  emailTemplatesAudienceAdmin: "Admin",
  emailTemplatesPreviewTitle: "Email preview",

  welcomeOfferSection: "Welcome offer",
  welcomeOfferSectionHint:
    "A one-time code emailed to new shoppers when they verify their email.",
  welcomeOfferEnabled: "Welcome offer",
  welcomeOfferPercent: "Discount",
  welcomeOfferMaxDiscount: "Maximum discount",
  welcomeOfferMaxDiscountHint:
    "Caps the discount in rupees. Enter 0 for no cap.",
  welcomeOfferMinOrder: "Minimum order value",
  welcomeOfferValidDays: "Valid for",
  welcomeOfferOn: "On — email a first-order code",
  welcomeOfferOff: "Off — no welcome code",

  emailHealthTitle: "Email delivery",
  emailHealthOk: "Healthy",
  emailHealthDegraded: "Degraded",
  emailHealthDown: "Not delivering",
  emailHealthStats:
    "Last {minutes} min: {sent} sent, {failed} failed, {stuck} waiting.",
  emailHealthLastFailure: "Latest problem ({category}): {error}",
  emailHealthLoadFailed: "Could not check email delivery.",

  notificationFilterErrorCategory: "Failure reason",
  notificationFilterAllCategories: "All reasons",
  notificationResend: "Resend",
  notificationResendDone: "Queued to send again.",
  notificationResendFailed: "Could not queue this email again.",

  orderReferenceLabel: "Order #{reference}",
} as const;
