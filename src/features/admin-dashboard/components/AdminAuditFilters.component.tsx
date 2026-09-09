"use client";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { FormFieldFrame, FormSection } from "@/shared/components/forms";
import { DateRangeFields } from "@/shared/components/DateRangeFields.component";
import { auditFiltersLabels } from "@/shared/constants/labels/auditFilters";

interface AdminAuditFiltersProps {
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

const ALL_ENTITY_TYPES_VALUE = "__all__";

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
  const entityTypeOptions = entityTypes.map((value) => (
    <SelectItem key={value} value={value}>
      {value}
    </SelectItem>
  ));

  return (
    <FormSection title={auditFiltersLabels.auditFilters} columns={3}>
      <FormFieldFrame
        label={auditFiltersLabels.auditEntityType}
        htmlFor="audit-filter-entity-type"
      >
        <Select
          value={entitySelectValue}
          onValueChange={(value) =>
            onEntityTypeChange(value === ALL_ENTITY_TYPES_VALUE ? "" : value)
          }
        >
          <SelectTrigger id="audit-filter-entity-type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_ENTITY_TYPES_VALUE}>
              {auditFiltersLabels.auditAllEntityTypes}
            </SelectItem>
            {entityTypeOptions}
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
          onChange={(e) => onActorChange(e.target.value)}
          placeholder={auditFiltersLabels.auditActorPlaceholder}
        />
      </FormFieldFrame>

      <div className="flex items-end">
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
      />
    </FormSection>
  );
}
