"use client";

import { useCallback } from "react";
import { Bike } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useCreateDeliveryAgentForm } from "../../../hooks/delivery-agents/useCreateDeliveryAgentForm.hook";
import { BulkImportAgentsDialog } from "../BulkImportAgentsDialog/index";
import { createDeliveryAgentFormStyles } from "../../../styles/delivery-agents/createDeliveryAgentForm.styles";
import { CreateDeliveryAgentFormFields } from "./CreateDeliveryAgentFormFields.component";

export interface CreateDeliveryAgentFormProps {
  onCreated: () => void;
  onCancel?: () => void;
}

export function CreateDeliveryAgentForm({
  onCreated,
  onCancel,
}: CreateDeliveryAgentFormProps) {
  const { form, setForm, pending, error, submit, canSubmit } =
    useCreateDeliveryAgentForm(onCreated);

  const handleSubmit = useCallback(() => {
    void submit();
  }, [submit]);

  return (
    <section className={createDeliveryAgentFormStyles.root}>
      <div className={createDeliveryAgentFormStyles.header}>
        <div className={createDeliveryAgentFormStyles.headerLeft}>
          <Bike
            className={createDeliveryAgentFormStyles.bikeIcon}
            aria-hidden="true"
          />
          <h2 className={createDeliveryAgentFormStyles.title}>
            Create new delivery agent
          </h2>
        </div>
        {onCancel ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className={createDeliveryAgentFormStyles.cancelGhostButton}
          >
            Cancel
          </Button>
        ) : null}
      </div>

      <CreateDeliveryAgentFormFields form={form} onChange={setForm} />

      <div className={createDeliveryAgentFormStyles.footer}>
        <div className={createDeliveryAgentFormStyles.footerActions}>
          <Button
            loading={pending}
            disabled={!canSubmit}
            onClick={handleSubmit}
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

        <div className={createDeliveryAgentFormStyles.bulkWrapper}>
          <span className={createDeliveryAgentFormStyles.bulkHint}>
            Have multiple agents?
          </span>
          <BulkImportAgentsDialog onImported={onCreated} />
        </div>
      </div>

      {error ? (
        <p className={createDeliveryAgentFormStyles.errorText}>{error}</p>
      ) : null}
    </section>
  );
}
