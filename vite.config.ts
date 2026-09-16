import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: mode === "development"
    ? {
        proxy: {
          "/api": {
            target: "https://oxwb0croja.execute-api.ap-southeast-1.amazonaws.com",
            changeOrigin: true,
            rewrite: (p) => p.replace(/^\/api/, ""),
            secure: true,
          },
        },
      }
    : undefined,
}))
