// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from '@tailwindcss/vite'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [  tailwindcss(),
    react(),
  ],
  root: path.resolve(__dirname),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./CollegeConnect/src"),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});
