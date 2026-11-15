"use client";

import { useState, useCallback, type ChangeEvent } from "react";

interface UseAddStaffDialogOptions {
  submitting: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { name: string; email: string }) => Promise<boolean>;
}

export function useAddStaffDialog({
  submitting,
  onOpenChange,
  onSubmit,
}: UseAddStaffDialogOptions) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const close = useCallback(() => {
    if (submitting) return;
    onOpenChange(false);
  }, [onOpenChange, submitting]);

  const canSubmit = Boolean(name.trim() && email.trim());

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (!next) {
        close();
        setName("");
        setEmail("");
        return;
      }
      onOpenChange(true);
    },
    [close, onOpenChange],
  );

  const handleNameChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }, []);

  const handleEmailChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }, []);

  const handleSubmit = useCallback(async () => {
    const success = await onSubmit({
      name: name.trim(),
      email: email.trim().toLowerCase(),
    });
    if (success) {
      setName("");
      setEmail("");
      onOpenChange(false);
    }
  }, [email, name, onOpenChange, onSubmit]);

  return {
    name,
    email,
    canSubmit,
    close,
    handleOpenChange,
    handleNameChange,
    handleEmailChange,
    handleSubmit,
  };
}
