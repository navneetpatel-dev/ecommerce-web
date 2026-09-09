import { SelectItem } from "@/shared/components/ui/select";

const ALL = "__ALL__";

interface NotificationFilterOptionsListProps {
  placeholder: string;
  options: readonly string[];
}

export function NotificationFilterOptionsList({
  placeholder,
  options,
}: NotificationFilterOptionsListProps) {
  return (
    <>
      <SelectItem value={ALL}>{placeholder}</SelectItem>
      {options.map((option) => (
        <SelectItem key={option} value={option}>
          {option}
        </SelectItem>
      ))}
    </>
  );
}

export { ALL };
