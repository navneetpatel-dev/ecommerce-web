"use client";

import { CheckCircle2, Send } from "lucide-react";
import { FormFieldFrame } from "@/shared/components/forms";
import { FormError } from "@/shared/components/forms/FormError.component";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { LABELS } from "@/shared/constants/labels";
import { CONTACT_LIMITS } from "../../constants/contact/contactTopics";
import { useContactMessageForm } from "../../hooks/contact/useContactMessageForm.hook";
import { contactMessageFormStyles as styles } from "../../styles/contact/contactMessageForm.styles";
import { ContactTopicOptions } from "./ContactTopicOptions.component";

/** Public contact form: no account needed; the sender gets a confirmation email with a reference. */
export function ContactMessageForm() {
  const form = useContactMessageForm();

  if (form.reference) {
    return (
      <div className={styles.sentBox} role="status">
        <div className={styles.sentIconBox}>
          <CheckCircle2 size={22} aria-hidden />
        </div>
        <h2 className={styles.sentHeading}>{LABELS.contactSentHeading}</h2>
        <p className={styles.sentBody}>{LABELS.contactSentBody}</p>
        <div>
          <span className={styles.referencePill}>{form.reference}</span>
        </div>
        <div className={styles.sentActions}>
          <Button
            type="button"
            variant="outline"
            onClick={form.handleSendAnother}
          >
            {LABELS.contactSentAnother}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit} noValidate className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>{LABELS.contactFormTitle}</h2>
        <p className={styles.hint}>{LABELS.contactFormHint}</p>
      </div>

      <div className={styles.grid}>
        <FormFieldFrame
          label={LABELS.contactFormName}
          htmlFor={form.ids.name}
          error={form.getError("name")}
        >
          <Input
            id={form.ids.name}
            autoComplete="name"
            placeholder="Jane Doe"
            value={form.values.name}
            onChange={form.handleName}
            error={Boolean(form.getError("name"))}
          />
        </FormFieldFrame>

        <FormFieldFrame
          label={LABELS.contactFormEmail}
          htmlFor={form.ids.email}
          error={form.getError("email")}
        >
          <Input
            id={form.ids.email}
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={form.values.email}
            onChange={form.handleEmail}
            error={Boolean(form.getError("email"))}
          />
        </FormFieldFrame>

        <FormFieldFrame
          label={LABELS.contactFormTopic}
          error={form.getError("topic")}
          className={styles.fullWidth}
        >
          <Select value={form.values.topic} onValueChange={form.handleTopic}>
            <SelectTrigger>
              <SelectValue placeholder={LABELS.contactFormTopicPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              <ContactTopicOptions />
            </SelectContent>
          </Select>
        </FormFieldFrame>

        <FormFieldFrame
          label={LABELS.contactFormSubject}
          htmlFor={form.ids.subject}
          error={form.getError("subject")}
          className={styles.fullWidth}
        >
          <Input
            id={form.ids.subject}
            placeholder="Brief summary of how we can help"
            value={form.values.subject}
            onChange={form.handleSubject}
            error={Boolean(form.getError("subject"))}
          />
        </FormFieldFrame>

        <FormFieldFrame
          label={LABELS.contactFormMessage}
          htmlFor={form.ids.message}
          error={form.getError("message")}
          className={styles.fullWidth}
        >
          <Textarea
            id={form.ids.message}
            rows={6}
            maxLength={CONTACT_LIMITS.messageMax}
            placeholder="Share order numbers, dates, or any helpful context..."
            value={form.values.message}
            onChange={form.handleMessage}
            error={Boolean(form.getError("message"))}
          />
          <div className={styles.messageFooter}>
            <span className={styles.charCount}>
              {form.values.message.length} / {CONTACT_LIMITS.messageMax}
            </span>
          </div>
        </FormFieldFrame>

        <div className={styles.honeypot} aria-hidden="true">
          <Input
            tabIndex={-1}
            autoComplete="off"
            name="website"
            value={form.values.website}
            onChange={form.handleWebsite}
          />
        </div>
      </div>

      <FormError error={form.submitError} fallback={LABELS.contactFormFailed} />

      <div className={styles.actions}>
        <span className={styles.slaNote}>
          Confirmation &amp; reference sent immediately by email.
        </span>
        <Button type="submit" loading={form.pending} disabled={form.pending}>
          <Send size={15} aria-hidden />
          {LABELS.contactFormSubmit}
        </Button>
      </div>
    </form>
  );
}
