import { defineConfig, defineDocs } from "fumadocs-mdx/config";
import { metaSchema, pageSchema } from "fumapress/adapters/mdx/schema";
import { remarkMdxMermaid } from "fumadocs-core/mdx-plugins/remark-mdx-mermaid";
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
    remarkPlugins: (plugins) => [...plugins, remarkMath, remarkMdxMermaid],
    // rehype-katex must run BEFORE Fumadocs' rehype-code (Shiki): remark-math
    // emits `<code class="language-math">` nodes, and Shiki would otherwise try
    // to highlight a non-existent "math" language. Prepending fixes the order.
    rehypePlugins: (plugins) => [rehypeKatex, ...plugins],
  },
});
