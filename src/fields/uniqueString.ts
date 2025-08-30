import { defineType, StringRule } from "sanity";

import { uniqueValidator } from "../validators";

/**
 * A reusable unique string field type.
 *
 * Example usage:
 * { name: "email", type: "unique:string" }
 */
export const uniqueString = defineType({
    name: "unique:string",
    title: "Unique String",
    type: "string",
    validation: (Rule: StringRule) => [
        Rule.custom(async (value, context) => uniqueValidator(value, context)),
    ],
});
