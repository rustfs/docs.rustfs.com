import defaultMdxComponents from "./mdx.js";
import { ComponentProps, FC } from "react";
import { LoaderConfig, LoaderOutput, Page } from "fumadocs-core/source";
//#region src/mdx.server.d.ts
/**
 * Extend the default Link component to resolve relative file paths in `href`.
 *
 * @param page the current page
 * @param source the source object
 * @param OverrideLink The component to override from
 */
declare function createRelativeLink<C extends LoaderConfig>(source: LoaderOutput<C>, page: Page | C['page'], OverrideLink?: FC<ComponentProps<'a'>>): FC<ComponentProps<'a'>>;
//#endregion
export { createRelativeLink, defaultMdxComponents as default };