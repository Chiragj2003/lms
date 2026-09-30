import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

// Same rules as the old .eslintrc.json ("next/core-web-vitals"), in the flat
// config format ESLint 9 requires. `next lint` was removed in Next 16. ESLint
// is pinned to v9: the plugins this config bundles don't run on ESLint 10 yet.
export default defineConfig([
    ...nextVitals,
    globalIgnores([
        ".next/**",
        "out/**",
        "build/**",
        "next-env.d.ts",
    ]),
]);
