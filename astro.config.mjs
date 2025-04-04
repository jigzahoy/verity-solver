// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
// https://astro.build/config
export default defineConfig({
  site: 'https://jigzahoy.github.io',
  base: 'verity-solver',
  vite: {
    plugins: [tailwindcss()],
  },
  experimental: {
    svg: {
      mode: "sprite",
    },
  },
});
