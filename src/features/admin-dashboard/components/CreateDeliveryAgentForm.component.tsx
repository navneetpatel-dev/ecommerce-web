"use client";

import { Bike } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useCreateDeliveryAgentForm } from "../hooks/useCreateDeliveryAgentForm.hook";
import { CreateDeliveryAgentFormFields } from "./CreateDeliveryAgentFormFields.component";
import { BulkImportAgentsDialog } from "./BulkImportAgentsDialog";

export function CreateDeliveryAgentForm({
  onCreated,
  onCancel,
}: {
  onCreated: () => void;
  onCancel?: () => void;
}) {
  const { form, setForm, pending, error, submit, canSubmit } =
    useCreateDeliveryAgentForm(onCreated);

  return (
    <section className="rounded-lg border border-line bg-surface p-5 md:p-6 shadow-elevation-1 space-y-5">
      <div className="flex items-center justify-between border-b border-line/60 pb-3">
        <div className="flex items-center gap-2">
          <Bike className="size-5 text-brand" aria-hidden="true" />
          <h2 className="font-display text-[1.125rem] font-semibold text-ink">
            Create new delivery agent
          </h2>
        </div>
        {onCancel ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="text-ink-muted hover:text-ink"
          >
            Cancel
          </Button>
        ) : null}
      </div>

      <CreateDeliveryAgentFormFields form={form} onChange={setForm} />

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line/60 pt-3">
        <div className="flex items-center gap-3">
          <Button
            loading={pending}
            disabled={!canSubmit}
            onClick={() => void submit()}
          >
            Create agent
          </Button>
          {onCancel ? (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={pending}
            >
              Cancel
            </Button>
          ) : null}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-caption font-medium text-ink-muted">
            Have multiple agents?
          </span>
          <BulkImportAgentsDialog onImported={onCreated} />
        </div>
      </div>

      {error ? <p className="text-body-sm text-danger">{error}</p> : null}
    </section>
  );
}
