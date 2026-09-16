import { defineConfig } from "vite";
import { codeInspectorPlugin } from "code-inspector-plugin";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    codeInspectorPlugin({
      bundler: "vite",
      editor: "code",
      behavior: {
        locate: true,
      },
    }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      // Local Vite → API Gateway (avoids CORS for RestHalf backend)
      "/api": {
        target: "https://oxwb0croja.execute-api.ap-southeast-1.amazonaws.com",
        changeOrigin: true,
        secure: true,
        rewrite: (p) => p.replace(/^\/api/, ""),
      },
      // Avoid browser CORS when calling ZentrumHub from local Vite
      "/zh-nexus": {
        target: "https://nexus.prod.zentrumhub.com",
        changeOrigin: true,
        secure: true,
        rewrite: (p) => p.replace(/^\/zh-nexus/, ""),
      },
      "/zh-autosuggest": {
        target: "https://autosuggest.travel.zentrumhub.com",
        changeOrigin: true,
        secure: true,
        rewrite: (p) => p.replace(/^\/zh-autosuggest/, ""),
      },
    },
  },
});
