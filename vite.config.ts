import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import press from "fumapress/vite";
import { fumadocsMdx } from "fumadocs-mdx/vite";

export default defineConfig({
  environments: {
    rsc: {
      build: { rolldownOptions: { platform: "neutral" } },
    },
    ssr: {
      build: { rolldownOptions: { platform: "neutral" } },
    },
  },
  plugins: [
    press({ adapter: "waku/adapters/cloudflare" }),
    fumadocsMdx(),
    tailwindcss(),
  ],
});
