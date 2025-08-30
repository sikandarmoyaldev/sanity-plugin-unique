/**
 * Convert a Sanity validation path into a valid GROQ field expression.
 *
 * Examples:
 *   ["slug", "current"]   → "slug.current"
 *   ["meta", "user-name"] → 'meta["user-name"]'
 *   ["items", 0, "name"]  → "items[0].name"
 */
export function pathToGroqField(
    path: (string | number)[] | undefined,
): string | null {
    if (!path || path.length === 0) return null;

    return path
        .map(seg => {
            if (typeof seg === "number") {
                return `[${seg}]`; // array index
            }

            // Use dot notation if valid JS identifier
            if (/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(seg)) {
                return `.${seg}`;
            }

            // Otherwise, use quoted property access
            const escaped = seg.replace(/"/g, '\\"');
            return `["${escaped}"]`;
        })
        .join("")
        .replace(/^\./, ""); // remove leading dot
}

/**
 * Normalize a field value for uniqueness comparison.
 *
 * Supports:
 *   - Plain strings/numbers
 *   - Slug objects { current: "value" }
 */
export function normalizeValue(value: unknown): string | null {
    if (value == null || value === "") return null;

    if (
        typeof value === "object" &&
        value !== null &&
        "current" in (value as any)
    ) {
        return String((value as any).current).trim();
    }

    return String(value).trim();
}

/**
 * Get the base ID and draft ID for a Sanity document.
 *
 * Example:
 *   _id = "drafts.abc123" → baseId = "abc123", draftId = "drafts.abc123"
 *   _id = "abc123"        → baseId = "abc123", draftId = "drafts.abc123"
 */
export function getDocumentIds(rawId: string | undefined | null) {
    if (!rawId) return { baseId: null, draftId: null };

    const baseId = rawId.replace(/^drafts\./, "");
    const draftId = `drafts.${baseId}`;
    return { baseId, draftId };
}
