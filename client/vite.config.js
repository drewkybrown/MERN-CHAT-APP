import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path"; // Import resolve function

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "/src/main.jsx": resolve(__dirname, "src/main.jsx"), // Configure the alias for main.jsx
    },
  },
});
