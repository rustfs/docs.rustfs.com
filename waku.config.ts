import { defineConfig } from "waku/config";
import tailwindcss from "@tailwindcss/vite";
import press from "fumapress/vite";
import mdx from "fumadocs-mdx/vite";

export default defineConfig({
  unstable_adapter: "waku/adapters/cloudflare",
  vite: {
    environments: {
      rsc: {
        build: { rolldownOptions: { platform: "neutral" } },
      },
      ssr: {
        build: { rolldownOptions: { platform: "neutral" } },
      },
    },
    plugins: [press(), mdx(), tailwindcss()],
  },
});
