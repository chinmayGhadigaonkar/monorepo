import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

// eslint-disable-next-line import/no-anonymous-default-export
export default [
    {
        ignores: ["**/node_modules/**", "**/.next/**", "**/out/**", "**/build/**", "next-env.d.ts"],
    },
    ...compat.extends("next/core-web-vitals"),
    ...compat.extends("next/typescript"),
    ...compat.extends("prettier"),
    {
        rules: {
            "@typescript-eslint/no-explicit-any": "error",
            "@typescript-eslint/no-unused-vars": "off",
            "@typescript-eslint/prefer-const": "off",
            "react/no-unescaped-entities": "off",
        },
    },
];
