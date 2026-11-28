type SearchableZone = {
  name?: unknown;
  states?: unknown;
  pincodePrefixes?: unknown;
};

const contains = (value: unknown, query: string) =>
  String(value ?? "")
    .toLowerCase()
    .includes(query);

const anyContains = (values: unknown, query: string) =>
  Array.isArray(values) && values.some((value) => contains(value, query));

/** Zones whose name, a state or a pincode prefix contains the search text. */
export function filterZones<T extends SearchableZone>(
  zones: T[],
  search: string,
): T[] {
  const query = search.toLowerCase();
  return zones.filter(
    (zone) =>
      contains(zone.name, query) ||
      anyContains(zone.states, query) ||
      anyContains(zone.pincodePrefixes, query),
  );
}
