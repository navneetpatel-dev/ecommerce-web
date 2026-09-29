/**
 * Escapes the characters that can end a `<script>` block early. The payload
 * carries user-controlled copy (product and vendor names, help article
 * titles), so a name containing `</script>` would otherwise close the tag and
 * let whatever follows run as markup. `\u003c` is still valid JSON and parses
 * back to the same character, so consumers see no difference.
 */
export function escapeJsonForScript(json: string): string {
  return json
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: escapeJsonForScript(JSON.stringify(data)),
      }}
    />
  );
}
