// @ts-check
import { defineConfig } from "astro/config";

import vue from "@astrojs/vue";

import tailwindcss from "@tailwindcss/vite";
import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  markdown: {
    shikiConfig: {
      theme: "github-dark",
    },
  },

  integrations: [vue()],
  output: "server",
  adapter: netlify(),

  vite: {
    plugins: [tailwindcss()],
  },
});
