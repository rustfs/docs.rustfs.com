import { PopoverTrigger } from "../../components/ui/popover.js";
import { ComponentProps } from "react";
//#region src/layouts/shared/page-actions.d.ts
/**
 * see https://fumadocs.dev/docs/integrations/llms#page-actions to customize.
 */
declare function MarkdownCopyButton({ markdownUrl, ...props }: ComponentProps<'button'> & {
  /**
   * A URL to fetch the raw Markdown/MDX content of page
   */
  markdownUrl: string;
}): import("react").JSX.Element;
/**
 * see https://fumadocs.dev/docs/integrations/llms#page-actions to customize.
 */
declare function ViewOptionsPopover({ markdownUrl, githubUrl, ...props }: ComponentProps<typeof PopoverTrigger> & {
  /**
   * A URL to the raw Markdown/MDX content of page
   */
  markdownUrl?: string;
  /**
   * Source file URL on GitHub
   */
  githubUrl?: string;
}): import("react").JSX.Element;
//#endregion
export { MarkdownCopyButton, ViewOptionsPopover };