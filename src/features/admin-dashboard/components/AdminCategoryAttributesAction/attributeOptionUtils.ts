import { CATEGORY_ATTRIBUTE_TYPE } from "@/shared/constants/statuses";

export function parseOptions(type: string, raw: string): unknown[] {
  if (type === CATEGORY_ATTRIBUTE_TYPE.BOOLEAN) return ["true", "false"];
  return raw
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

export function optionsToInput(options: unknown[] | undefined): string {
  if (!options?.length) return "";
  return options.map((opt) => String(opt)).join(", ");
}
