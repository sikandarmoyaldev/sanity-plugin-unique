import groq from "groq";
import { SanityDocument, ValidationContext } from "sanity";

/**
 * Unique field validator for Sanity string fields.
 *
 * This function checks whether a given string value is unique across all
 * documents of the same type in Sanity.
 *
 * ## Behavior:
 * - If `value` is empty/undefined → returns `true` (skips uniqueness check).
 * - Otherwise → queries Sanity to count documents with the same field value,
 *   excluding the current document (so updates don’t flag themselves).
 * - Returns an error message if duplicates exist, otherwise `true`.
 *
 * @param field   - The field name to check (e.g. `"email"`, `"username"`).
 * @param value   - The field value provided by the user.
 * @param context - Sanity validation context (provides `document`, `getClient`).
 *
 * @returns `true` if unique, or a string with the error message.
 */
export async function uniqueValidator(
    value: string | undefined,
    context: ValidationContext,
) {
    // IMPORTANT: Skip check if field is optional and empty
    if (!value) return true;

    // Grab the actual field name from context
    const fieldName = context.path?.[0] as string;

    // Get the sanity client
    const { getClient, document } = context;
    const client = getClient({ apiVersion: "2023-01-01" });

    const id = (document as SanityDocument)?._id;

    const query = groq`count(*[
        _type == $type &&
        ${fieldName} == $value &&
        _id != $id
    ])`;
    const params = { type: document?._type, value, id };

    const count = await client.fetch<number>(query, params);

    return count > 0 ? `This ${fieldName} is already taken.` : true;
}
