// @ts-check
import { defineConfig } from "astro/config";

import vue from "@astrojs/vue";

import tailwindcss from "@tailwindcss/vite";
import netlify from "@astrojs/netlify";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  markdown: {
    shikiConfig: {
      theme: "github-dark",
    },
  },

  integrations: [vue(), mdx()],
  output: "server",
  adapter: netlify(),

  vite: {
    plugins: [tailwindcss()],
  },
});