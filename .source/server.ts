// @ts-nocheck
/// <reference types="vite/client" />
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>({"doc":{"passthroughs":["extractedReferences"]}});

export const docs = await create.docsLazy("docs", "content", import.meta.glob(["./**/*.{json,yaml}"], {
  "base": "./../content",
  "query": {
    "collection": "docs"
  },
  "import": "default",
  "eager": true
}), import.meta.glob(["./**/*.{mdx,md}"], {
  "base": "./../content",
  "query": {
    "collection": "docs",
    "only": "frontmatter"
  },
  "import": "frontmatter",
  "eager": true
}), import.meta.glob(["./**/*.{mdx,md}"], {
  "base": "./../content",
  "query": {
    "collection": "docs"
  },
  "eager": false
}));