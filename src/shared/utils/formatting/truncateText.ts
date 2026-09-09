import { TABLE_CELL_MAX_CHARS } from '@/shared/constants/table/table'

/** Truncate plain text for table cells; hover surfaces show the full string. */
export function truncateText(value: string, maxChars = TABLE_CELL_MAX_CHARS): {
  text: string
  truncated: boolean
  full: string
} {
  const full = value
  if (full.length <= maxChars) {
    return { text: full, truncated: false, full }
  }
  return {
    text: `${full.slice(0, maxChars).trimEnd()}…`,
    truncated: true,
    full,
  }
}
