import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    assetsInclude: [
        "**/*.xlsx",
        "**/*.pdf",
        "**/*.png",
        "**/*.jpg",
        "**/*.jpeg",
        "**/*.svg",
        "**/*.zip",
        "**/*.doc",
        "**/*.docx",
        "**/*.ppt",
        "**/*.pptx",
    ],
});
