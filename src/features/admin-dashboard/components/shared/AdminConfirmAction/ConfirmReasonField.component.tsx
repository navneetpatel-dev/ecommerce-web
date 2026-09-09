"use client";

import type { ChangeEvent } from "react";
import { FormFieldFrame } from "@/shared/components/forms";
import { Textarea } from "@/shared/components/ui/textarea";
import { adminConfirmActionStyles as styles } from "../../../styles/shared/adminConfirmAction.styles";

interface ConfirmReasonFieldProps {
  label: string;
  hint?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

export function ConfirmReasonField({
  label,
  hint,
  value,
  onChange,
}: ConfirmReasonFieldProps) {
  return (
    <FormFieldFrame label={label} htmlFor="admin-confirm-reason" hint={hint}>
      <Textarea
        id="admin-confirm-reason"
        value={value}
        onChange={onChange}
        rows={3}
        placeholder={label}
        className={styles.reasonTextarea}
      />
    </FormFieldFrame>
  );
}
