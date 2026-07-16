import { LinkProps } from "./link.js";
//#region src/dynamic-link.d.ts
type DynamicLinkProps = LinkProps;
/**
 * Extends the default `Link` component
 *
 * It supports dynamic hrefs, which means you can use `/[lang]/my-page` with `dynamicHrefs` enabled
 */
declare function DynamicLink({ href, ref, ...props }: DynamicLinkProps): import("react").JSX.Element;
declare function updateHref(href: string, params: Record<string, string | string[]>): string;
//#endregion
export { DynamicLink, DynamicLink as default, DynamicLinkProps, updateHref };