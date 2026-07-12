import { defineConfig, defineDocs } from "fumadocs-mdx/config";
import { metaSchema, pageSchema } from "fumapress/adapters/mdx/schema";
import { remarkMdxMermaid } from "fumadocs-core/mdx-plugins/remark-mdx-mermaid";
import { remarkAdmonition } from "fumadocs-core/mdx-plugins/remark-admonition";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

export const docs = defineDocs({
  dir: "content",
  docs: {
    async: true,
    schema: pageSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

// Global MDX options. Using the function form of `remarkPlugins` / `rehypePlugins`
// appends to Fumadocs' default plugin set (which handles headings, images, links,
// code, etc.) instead of replacing it.
export default defineConfig({
  mdxOptions: {
    remarkPlugins: (plugins) => [
      ...plugins,
      // Custom typeMap: list `warning` before `warn` so `:::warning[Title]`
      // isn't greedily matched by the shorter `warn` key (which would drop the
      // title). Values must be valid Callout types: info | warn | error.
      [
        remarkAdmonition,
        {
          typeMap: {
            info: "info",
            note: "info",
            tip: "info",
            important: "info",
            success: "info",
            warning: "warn",
            warn: "warn",
            caution: "warn",
            danger: "error",
            error: "error",
          },
        },
      ],
      remarkMath,
      remarkMdxMermaid,
    ],
    // rehype-katex must run BEFORE Fumadocs' rehype-code (Shiki): remark-math
    // emits `<code class="language-math">` nodes, and Shiki would otherwise try
    // to highlight a non-existent "math" language. Prepending fixes the order.
    rehypePlugins: (plugins) => [rehypeKatex, ...plugins],
  },
});
