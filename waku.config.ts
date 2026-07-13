import { defineConfig } from "waku/config";
import tailwindcss from "@tailwindcss/vite";
import press from "fumapress/vite";
import mdx from "fumadocs-mdx/vite";

export default defineConfig({
  unstable_adapter: "waku/adapters/cloudflare",
  vite: {
    plugins: [press(), mdx(), tailwindcss()],
  },
});
