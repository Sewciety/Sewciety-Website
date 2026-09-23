import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

export default defineConfig(({ command }) => ({
  server: { port: Number(process.env["PORT"]) || 8080 },
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  plugins: [
    tailwindcss(),
    tanstackStart({
      // Use src/server.ts (our SSR error wrapper) as the server entry.
      server: { entry: "server" },
      // Anything under a server/ folder must never end up in the browser bundle.
      importProtection: {
        behavior: "error",
        client: { files: ["**/server/**"], specifiers: ["server-only"] },
      },
    }),
    // Nitro picks the deploy target from the build environment (Vercel,
    // Netlify, Cloudflare...) and falls back to a plain Node server.
    ...(command === "build" ? [nitro()] : []),
    viteReact(),
  ],
}));
