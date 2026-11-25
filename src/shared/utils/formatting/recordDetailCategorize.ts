import { isImageFieldKey } from "@/shared/utils/media/imageField";
import { UUID_REGEX } from "./recordDetailConstants";
import type { RecordDetailField } from "./recordDetails";

export interface CategorizedRecordFields {
  media: RecordDetailField[];
  spotlight: RecordDetailField[];
  properties: RecordDetailField[];
  objects: RecordDetailField[];
  arrays: RecordDetailField[];
  system: RecordDetailField[];
}

const SYSTEM_KEYS = new Set([
  "id",
  "entityId",
  "rawKind",
  "isEdit",
  "createdAt",
  "updatedAt",
  "sentAt",
  "receivedAt",
  "restockedAt",
  "resolvedAt",
]);

const SPOTLIGHT_KEYS = [
  "onquestion",
  "question",
  "text",
  "answer",
  "body",
  "description",
  "rejectionreason",
  "disputereason",
  "disputedescription",
  "disputeresolutionnotes",
  "reason",
  "notes",
  "note",
  "message",
  "previousbody",
];

function isSystemField(f: RecordDetailField): boolean {
  if (SYSTEM_KEYS.has(f.key)) return true;
  if (typeof f.value === "string" && UUID_REGEX.test(f.value.trim())) {
    return true;
  }
  return false;
}

function isSpotlightField(f: RecordDetailField): boolean {
  if (typeof f.value !== "string" || !f.value.trim()) return false;
  const lower = f.key.toLowerCase();
  if (SPOTLIGHT_KEYS.includes(lower)) return true;
  return f.value.trim().length > 72;
}

function isEmptyPrimitive(value: unknown): boolean {
  return value === null || value === undefined || value === "";
}

export function categorizeDetailFields(
  fields: RecordDetailField[],
): CategorizedRecordFields {
  const media: RecordDetailField[] = [];
  const spotlight: RecordDetailField[] = [];
  const properties: RecordDetailField[] = [];
  const objects: RecordDetailField[] = [];
  const arrays: RecordDetailField[] = [];
  const system: RecordDetailField[] = [];

  for (const f of fields) {
    if (isImageFieldKey(f.key)) {
      if (f.value && (!Array.isArray(f.value) || f.value.length > 0)) {
        media.push(f);
      }
    } else if (Array.isArray(f.value)) {
      if (f.value.length > 0) arrays.push(f);
    } else if (typeof f.value === "object" && f.value !== null) {
      if (Object.keys(f.value).length > 0) objects.push(f);
    } else if (isSystemField(f)) {
      if (!isEmptyPrimitive(f.value)) system.push(f);
    } else if (isEmptyPrimitive(f.value)) {
      // Omit empty primitive noise from primary inspector
      continue;
    } else if (isSpotlightField(f)) {
      spotlight.push(f);
    } else {
      properties.push(f);
    }
  }

  return { media, spotlight, properties, objects, arrays, system };
}
