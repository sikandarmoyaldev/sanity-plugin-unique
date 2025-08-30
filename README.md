# 🔑 sanity-plugin-unique

A simple **Sanity Studio v3** plugin that provides a reusable **unique string field type**.  
It ensures fields like `email`, `username`, or any other string are **globally unique** across documents.

## ✨ Features

- ✅ Easy to use → Just set `type: "unique:string"`.
- ✅ Automatically detects field name (no manual config needed).
- ✅ Skips validation if the field is optional/empty.
- ✅ Works across all documents of the same schema type.
- ✅ Clear error messages like: `This [fieldName] is already taken.`

## 📦 Installation

```bash
npm install sanity-plugin-unique
# or
yarn add sanity-plugin-unique
# or
pnpm add sanity-plugin-unique
```

## 🚀 Usage

1. Add the plugin in your `sanity.config.ts`:

    ```ts
    import { defineConfig } from "sanity";
    import { uniquePlugin } from "sanity-plugin-unique";

    export default defineConfig({
      name: "default",
      title: "My Sanity Project",
      plugins: [uniquePlugin()],
    });
    ```

2. Use in your schema

    ```ts
    // schema/user.ts
    import { defineType } from "sanity";

    export const user = defineType({
      name: "user",
      title: "User",
      type: "document",
      fields: [
        {
          name: "email",
          title: "Email",
          type: "unique:string",
        },
        {
          name: "username",
          title: "Username",
          type: "unique:string",
        },
      ],
    });
    ```

## 🤝 Contributing

Want to contribute to this project? Awesome! 🎉
Please read our [Contributing Guide](CONTRIBUTING.md) for details on how to get started, development setup, coding guidelines, and the release process.
