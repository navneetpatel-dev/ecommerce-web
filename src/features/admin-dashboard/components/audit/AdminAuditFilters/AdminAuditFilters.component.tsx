"use client";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { FormFieldFrame, FormSection } from "@/shared/components/forms";
import { DateRangeFields } from "@/shared/components/DateRangeFields.component";
import { dateRangeToolbarStyles } from "@/shared/styles/forms/dateRangeToolbar.styles";
import { auditFiltersLabels } from "@/shared/constants/labels/auditFilters";
import { adminAuditFiltersStyles } from "../../../styles/audit/adminAuditFilters.styles";
import {
  EntityTypeOptionsList,
  ALL_ENTITY_TYPES_VALUE,
} from "./EntityTypeOptionsList.component";
import { useAdminAuditFiltersHandlers } from "../../../hooks/audit/useAdminAuditFiltersHandlers.hook";

export interface AdminAuditFiltersProps {
  entityType: string;
  actor: string;
  from: string;
  to: string;
  entityTypes: readonly string[];
  onEntityTypeChange: (value: string) => void;
  onActorChange: (value: string) => void;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  onClear: () => void;
}

export function AdminAuditFilters({
  entityType,
  actor,
  from,
  to,
  entityTypes,
  onEntityTypeChange,
  onActorChange,
  onFromChange,
  onToChange,
  onClear,
}: AdminAuditFiltersProps) {
  const entitySelectValue = entityType || ALL_ENTITY_TYPES_VALUE;
  const { handleEntityTypeChange, handleActorChange } =
    useAdminAuditFiltersHandlers({ onEntityTypeChange, onActorChange });

  return (
    <FormSection title={auditFiltersLabels.auditFilters} columns={3}>
      <FormFieldFrame
        label={auditFiltersLabels.auditEntityType}
        htmlFor="audit-filter-entity-type"
      >
        <Select
          value={entitySelectValue}
          onValueChange={handleEntityTypeChange}
        >
          <SelectTrigger id="audit-filter-entity-type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <EntityTypeOptionsList entityTypes={entityTypes} />
          </SelectContent>
        </Select>
      </FormFieldFrame>

      <FormFieldFrame
        label={auditFiltersLabels.auditActor}
        htmlFor="audit-filter-actor"
      >
        <Input
          id="audit-filter-actor"
          value={actor}
          onChange={handleActorChange}
          placeholder={auditFiltersLabels.auditActorPlaceholder}
        />
      </FormFieldFrame>

      <div className={adminAuditFiltersStyles.clearButtonWrapper}>
        <Button type="button" variant="outline" onClick={onClear}>
          {auditFiltersLabels.auditClearFilters}
        </Button>
      </div>

      <DateRangeFields
        from={from}
        to={to}
        onFromChange={onFromChange}
        onToChange={onToChange}
        fromId="audit-filter-from"
        toId="audit-filter-to"
        className={dateRangeToolbarStyles.dateFields}
      />
    </FormSection>
  );
}
