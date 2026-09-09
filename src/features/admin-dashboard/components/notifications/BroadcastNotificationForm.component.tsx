"use client";

import { Send } from "lucide-react";
import { FormFieldFrame } from "@/shared/components/forms";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Button } from "@/shared/components/ui/button";
import type { RoleName } from "@/shared/constants/labels";
import { notificationsAdminLabels as LABELS } from "@/shared/constants/labels/notificationsAdmin";
import { adminFormWidgetsStyles } from "../../styles/shared/adminFormWidgets.styles";
import { useBroadcastNotificationForm } from "../../hooks/notifications/useBroadcastNotificationForm.hook";
import { BroadcastRoleOptions } from "./BroadcastRoleOptions.component";

export function BroadcastNotificationForm() {
  const form = useBroadcastNotificationForm();

  return (
    <div className={adminFormWidgetsStyles.broadcastCard}>
      <div>
        <h2 className={adminFormWidgetsStyles.broadcastTitle}>
          {LABELS.broadcastTitle}
        </h2>
        <p className={adminFormWidgetsStyles.broadcastHint}>
          {LABELS.broadcastHint}
        </p>
      </div>
      <div className={adminFormWidgetsStyles.gridSm2}>
        <FormFieldFrame label={LABELS.broadcastTargetRole}>
          <Select
            value={form.role}
            onValueChange={(value) => form.setRole(value as RoleName)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <BroadcastRoleOptions />
            </SelectContent>
          </Select>
        </FormFieldFrame>
        <FormFieldFrame label={LABELS.broadcastSubject}>
          <Input
            value={form.subject}
            onChange={(event) => form.setSubject(event.target.value)}
            placeholder={LABELS.broadcastSubjectPlaceholder}
            maxLength={200}
          />
        </FormFieldFrame>
      </div>
      <FormFieldFrame label={LABELS.broadcastMessage}>
        <Textarea
          value={form.message}
          onChange={(event) => form.setMessage(event.target.value)}
          placeholder={LABELS.broadcastMessagePlaceholder}
          maxLength={5000}
        />
      </FormFieldFrame>
      {form.error ? (
        <p className={adminFormWidgetsStyles.errorSm}>{form.error}</p>
      ) : null}
      {form.result ? (
        <p className={adminFormWidgetsStyles.successSm}>{form.result}</p>
      ) : null}
      <Button loading={form.pending} onClick={() => void form.submit()}>
        <Send className={adminFormWidgetsStyles.iconSm} aria-hidden="true" />
        {LABELS.broadcastSubmit}
      </Button>
    </div>
  );
}
