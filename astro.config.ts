import mdx from "@astrojs/mdx";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://shigi-blog.netlify.app",
  integrations: [mdx()],
  trailingSlash: "never",
  markdown: {
    shikiConfig: {
      theme: "github-light",
    },
  },
});
