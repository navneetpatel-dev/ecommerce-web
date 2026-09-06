"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { FormFieldFrame } from "@/shared/components/forms";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Button } from "@/shared/components/ui/button";
import {
  ROLE_VALUES,
  ROLE_LABELS,
  type RoleName,
} from "@/shared/constants/labels";
import { notificationsAdminLabels as LABELS } from "@/shared/constants/labels/notificationsAdmin";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import { notificationsApi } from "../api/notifications.api";

export function BroadcastNotificationForm() {
  const [role, setRole] = useState<RoleName>(ROLE_VALUES[0]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!subject.trim() || !message.trim()) {
      setError(LABELS.broadcastMissingFields);
      return;
    }
    setPending(true);
    setError(null);
    setResult(null);
    try {
      const outcome = await notificationsApi.broadcast({
        role,
        subject: subject.trim(),
        message: message.trim(),
      });
      setResult(
        `Queued for ${outcome.queued} of ${outcome.targeted} matching users.`,
      );
      setSubject("");
      setMessage("");
    } catch (sendError) {
      setError(getApiErrorMessage(sendError, "Could not send the broadcast."));
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="space-y-4 rounded-md border border-line-strong bg-surface-raised p-4">
      <div>
        <h2 className="text-body font-medium text-ink">
          {LABELS.broadcastTitle}
        </h2>
        <p className="mt-1 text-body-sm text-ink-muted">
          {LABELS.broadcastHint}
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormFieldFrame label={LABELS.broadcastTargetRole}>
          <Select
            value={role}
            onValueChange={(value) => setRole(value as RoleName)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ROLE_VALUES.map((value) => (
                <SelectItem key={value} value={value}>
                  {ROLE_LABELS[value]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormFieldFrame>
        <FormFieldFrame label={LABELS.broadcastSubject}>
          <Input
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            placeholder={LABELS.broadcastSubjectPlaceholder}
            maxLength={200}
          />
        </FormFieldFrame>
      </div>
      <FormFieldFrame label={LABELS.broadcastMessage}>
        <Textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder={LABELS.broadcastMessagePlaceholder}
          maxLength={5000}
        />
      </FormFieldFrame>
      {error ? <p className="text-body-sm text-danger">{error}</p> : null}
      {result ? <p className="text-body-sm text-success">{result}</p> : null}
      <Button loading={pending} onClick={() => void submit()}>
        <Send className="size-4" aria-hidden="true" />
        {LABELS.broadcastSubmit}
      </Button>
    </div>
  );
}
