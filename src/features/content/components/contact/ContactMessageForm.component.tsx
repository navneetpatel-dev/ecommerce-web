"use client";

import {
  FormFieldFrame,
  FormSection,
  FormStack,
} from "@/shared/components/forms";
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
import { useContactMessageForm } from "../../hooks/contact/useContactMessageForm.hook";
import { contactMessageFormStyles as styles } from "../../styles/contact/contactMessageForm.styles";
import { ContactTopicOptions } from "./ContactTopicOptions.component";

/** Public contact form: no account needed; the sender gets a confirmation email with a reference. */
export function ContactMessageForm() {
  const form = useContactMessageForm();

  if (form.reference) {
    return (
      <div className={styles.sentBox} role="status">
        <h2 className={styles.sentHeading}>{LABELS.contactSentHeading}</h2>
        <p className={styles.sentBody}>{LABELS.contactSentBody}</p>
        <p className={styles.reference}>{form.reference}</p>
        <Button
          type="button"
          variant="outline"
          onClick={form.handleSendAnother}
        >
          {LABELS.contactSentAnother}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit} noValidate className={styles.container}>
      <FormStack>
        <FormSection
          title={LABELS.contactFormTitle}
          hint={LABELS.contactFormHint}
        >
          <div className={styles.grid}>
            <FormFieldFrame
              label={LABELS.contactFormName}
              htmlFor={form.ids.name}
              error={form.getError("name")}
            >
              <Input
                id={form.ids.name}
                autoComplete="name"
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
              <Select
                value={form.values.topic}
                onValueChange={form.handleTopic}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={LABELS.contactFormTopicPlaceholder}
                  />
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
                maxLength={form.messageLimit}
                value={form.values.message}
                onChange={form.handleMessage}
                error={Boolean(form.getError("message"))}
              />
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
        </FormSection>
        <FormError
          error={form.submitError}
          fallback={LABELS.contactFormFailed}
        />
        <div className={styles.actions}>
          <Button type="submit" loading={form.pending} disabled={form.pending}>
            {LABELS.contactFormSubmit}
          </Button>
        </div>
      </FormStack>
    </form>
  );
}
