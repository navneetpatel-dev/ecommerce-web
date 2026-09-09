import { FormFieldFrame } from "@/shared/components/forms";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { LABELS } from "@/shared/constants/labels";
import { SUPPORT_TICKET_CATEGORY_VALUES } from "@/shared/constants/statuses";
import { TICKET_CATEGORY_LABEL } from "../../../utils/detail/labels";
import { ALL } from "../../../hooks/filters/useTicketFiltersHandlers.hook";

interface TicketCategoryFilterSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function TicketCategoryFilterSelect({
  value,
  onChange,
}: TicketCategoryFilterSelectProps) {
  return (
    <FormFieldFrame label={LABELS.category}>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={LABELS.ticketFilterAllCategories} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>
            {LABELS.ticketFilterAllCategories}
          </SelectItem>
          {SUPPORT_TICKET_CATEGORY_VALUES.map((category) => (
            <SelectItem key={category} value={category}>
              {TICKET_CATEGORY_LABEL[category]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormFieldFrame>
  );
}
