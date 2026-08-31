import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import { isCanonicalSitemapUrl } from "./src/lib/sitemap";

export default defineConfig({
  site: "https://shigi-blog.netlify.app",
  integrations: [
    mdx(),
    sitemap({
      filter: isCanonicalSitemapUrl,
      namespaces: {
        news: false,
        xhtml: false,
        image: false,
        video: false,
      },
    }),
  ],
  trailingSlash: "never",
  markdown: {
    shikiConfig: {
      theme: "github-light",
    },
  },
});
