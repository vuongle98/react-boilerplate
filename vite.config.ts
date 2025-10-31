import react from "@vitejs/plugin-react-swc";
import { componentTagger } from "lovable-tagger";
import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    port: 8080,
    proxy: {
      "/api/core": {
        target: "http://localhost:8082", // The backend API URL
        changeOrigin: true, // Ensures the origin is changed to the target
      },
      "/api/v1/bots": {
        target: "http://localhost:8082", // The backend API URL
        changeOrigin: true, // Ensures the origin is changed to the target
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(
    Boolean
  ),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
