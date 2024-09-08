import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: "./src/",
  // Load plugins here, eg.
  plugins: [react()],
  build: {
    outDir: "../lib/build",
    rollupOptions: {
      preserveEntrySignatures: "exports-only",
      input: "./src/main.jsx",
      output: {
        dir: "./build",
        entryFileNames: "main.js",
        assetFileNames: "main.css",
      },
    },
  },
});
