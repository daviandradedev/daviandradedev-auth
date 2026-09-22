import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "happy-dom",
    include: ["src/**/*.test.ts", "tests/unit/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary", "json"],
      include: ["src/lib/**/*.ts"],
      exclude: [
        "src/lib/auth.ts",
        "src/lib/auth-client.ts",
        "src/lib/db/**",
        "src/lib/api/**",
        "src/lib/contexts/**",
        "src/lib/translations.ts",
        "src/**/*.test.ts",
      ],
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100,
      },
    },
  },
});
