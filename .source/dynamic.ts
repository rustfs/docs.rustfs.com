// @ts-nocheck
/// <reference types="vite/client" />
import { dynamic } from 'fumadocs-mdx/runtime/dynamic';
import * as Config from '../source.config';

const create = await dynamic<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>(Config, {"configPath":"/Users/overtrue/www/docs.rustfs.com/.claude/worktrees/rustfs-docs-review-4dab79/source.config.ts","environment":"vite","outDir":"/Users/overtrue/www/docs.rustfs.com/.claude/worktrees/rustfs-docs-review-4dab79/.source"}, {"doc":{"passthroughs":["extractedReferences"]}});