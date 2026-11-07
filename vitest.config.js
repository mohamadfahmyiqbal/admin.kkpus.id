import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/setupTests.js"],
    include: ["src/**/*.test.{js,jsx}"],
  },
  resolve: {
    alias: {
      "virtual:pwa-register/react": path.resolve(__dirname, "./src/mocks/pwa-register-mock.js"),
    },
  },
});
