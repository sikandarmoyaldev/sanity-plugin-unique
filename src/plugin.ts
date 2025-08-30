import { definePlugin } from "sanity";

import { uniqueString } from "./fields/uniqueString";

/**
 * Sanity Plugin: Unique Field Validator
 *
 * Currently supported fields: string
 */
export const uniquePlugin = definePlugin(() => {
    return {
        name: "sanity-plugin-unique",
        schema: {
            types: [uniqueString],
        },
    };
});
