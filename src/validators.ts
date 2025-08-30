import groq from "groq";
import type { SanityDocument, ValidationContext } from "sanity";

import { getDocumentIds, normalizeValue, pathToGroqField } from "./utils";

/**
 * Unique field validator for Sanity string/slug fields.
 *
 * Features:
 * - Skips validation if field is empty.
 * - Supports nested fields (e.g. slug.current, meta.email).
 * - Normalizes draft & published IDs to avoid self-duplicate errors.
 * - Works with both new and existing documents.
 *
 * @param value   The field value being validated.
 * @param context Sanity validation context.
 * @returns `true` if unique, or an error message string.
 */
export async function uniqueValidator(
    value: unknown,
    context: ValidationContext,
) {
    try {
        // 1. Normalize value (string or slug { current })
        const normalized = normalizeValue(value);
        if (!normalized) return true;

        // 2. Derive GROQ field expression from validation path
        const fieldExpr = pathToGroqField(context.path as any);
        if (!fieldExpr) return true; // can't validate without field path

        const { getClient, document } = context;
        const client = getClient({ apiVersion: "2023-01-01" });

        const rawId = (document as SanityDocument | undefined)?._id ?? null;
        const { baseId, draftId } = getDocumentIds(rawId);
        const docType = document?._type ?? null;
        if (!docType) return true;

        // 3. Build GROQ query
        let query: string;
        const params: Record<string, any> = {
            type: docType,
            value: normalized,
        };

        if (baseId) {
            params.baseId = baseId;
            params.draftId = draftId;
            query = groq`count(*[
                _type == $type &&
                ${fieldExpr} == $value &&
                !(_id in [$baseId, $draftId])
            ])`;
        } else {
            query = groq`count(*[
                _type == $type &&
                ${fieldExpr} == $value
            ])`;
        }

        // 4. Execute query
        const count = await client.fetch<number>(query, params);

        // 5. Return result
        const label =
            (context.type?.title as string) ||
            (context.type?.name as string) ||
            fieldExpr;

        return count > 0 ? `This ${label} is already taken.` : true;
    } catch (err) {
        // Allow save if something goes wrong (prevent blocking users)
        console.error("uniqueValidator error:", err);
        return true;
    }
}
