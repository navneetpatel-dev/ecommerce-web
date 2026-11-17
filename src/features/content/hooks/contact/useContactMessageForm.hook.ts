"use client";

import { useId, useState, type ChangeEvent, type FormEvent } from "react";
import { LABELS } from "@/shared/constants/labels";
import { useManualFormFieldErrors } from "@/shared/hooks/forms/useManualFormFieldErrors.hook";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import { contactApi } from "../../api/contact/contact.api";
import {
  CONTACT_LIMITS,
  EMAIL_PATTERN,
  type ContactTopic,
} from "../../constants/contact/contactTopics";

type ContactField = "name" | "email" | "topic" | "subject" | "message";

/** State, validation and submission for the public contact form. */
export function useContactMessageForm() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const ids = {
    name: useId(),
    email: useId(),
    subject: useId(),
    message: useId(),
  };
  const [name, setName] = useState(currentUser?.name ?? "");
  const [email, setEmail] = useState(currentUser?.email ?? "");
  const [topic, setTopic] = useState<ContactTopic | "">("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [pending, setPending] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const { clearAll, clearField, setErrors, getError } =
    useManualFormFieldErrors<ContactField>();

  const validate = (): boolean => {
    const errors: Partial<Record<ContactField, string>> = {};
    if (name.trim().length < CONTACT_LIMITS.nameMin)
      errors.name = LABELS.contactFormNameRequired;
    if (!EMAIL_PATTERN.test(email.trim()))
      errors.email = LABELS.contactFormEmailInvalid;
    if (!topic) errors.topic = LABELS.contactFormTopicRequired;
    if (subject.trim().length < CONTACT_LIMITS.subjectMin)
      errors.subject = LABELS.contactFormSubjectShort;
    if (message.trim().length < CONTACT_LIMITS.messageMin)
      errors.message = LABELS.contactFormMessageShort;
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitError(null);
    if (!validate() || !topic) return;
    setPending(true);
    try {
      const result = await contactApi.send({
        name: name.trim(),
        email: email.trim(),
        topic,
        subject: subject.trim(),
        message: message.trim(),
        website,
      });
      setReference(result.reference);
    } catch (error) {
      setSubmitError(getApiErrorMessage(error, LABELS.contactFormFailed));
    } finally {
      setPending(false);
    }
  };

  const handleSendAnother = () => {
    clearAll();
    setSubject("");
    setMessage("");
    setTopic("");
    setReference(null);
  };

  const handleName = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
    clearField("name");
  };
  const handleEmail = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    clearField("email");
  };
  const handleSubject = (event: ChangeEvent<HTMLInputElement>) => {
    setSubject(event.target.value);
    clearField("subject");
  };
  const handleMessage = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
    clearField("message");
  };
  const handleTopic = (value: string) => {
    setTopic(value as ContactTopic);
    clearField("topic");
  };
  const handleWebsite = (event: ChangeEvent<HTMLInputElement>) =>
    setWebsite(event.target.value);

  return {
    ids,
    values: { name, email, topic, subject, message, website },
    getError,
    pending,
    submitError,
    reference,
    handleSubmit,
    handleSendAnother,
    handleName,
    handleEmail,
    handleSubject,
    handleMessage,
    handleTopic,
    handleWebsite,
    messageLimit: CONTACT_LIMITS.messageMax,
  };
}
