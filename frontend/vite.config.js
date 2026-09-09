import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const configDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

  ],
  resolve: {
    alias: {
      "@": path.resolve(configDir, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5050",
        changeOrigin: true,
      },
      "/uploads": {
        target: "http://localhost:5050",
        changeOrigin: true,
      },
    },
  },
});
