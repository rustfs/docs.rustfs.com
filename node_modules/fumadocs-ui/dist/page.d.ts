import { Breadcrumb } from "./layouts/docs/page/slots/breadcrumb.js";
import { DocsBody, DocsDescription, DocsPageProps as DocsPageProps$1, DocsTitle, EditOnGitHub, PageLastUpdate } from "./layouts/docs/page/index.js";
import { ComponentProps } from "react";
//#region src/page.d.ts
interface EditOnGitHubOptions extends Omit<ComponentProps<'a'>, 'href' | 'children'> {
  owner: string;
  repo: string;
  /**
   * SHA or ref (branch or tag) name.
   *
   * @defaultValue main
   */
  sha?: string;
  /**
   * File path in the repo
   */
  path: string;
}
interface DocsPageProps extends DocsPageProps$1 {
  editOnGithub?: EditOnGitHubOptions;
  lastUpdate?: Date | string | number;
}
/**
 * For separate MDX page
 */
declare function withArticle(props: ComponentProps<'main'>): import("react").JSX.Element;
declare function DocsPage({ lastUpdate, editOnGithub, children, ...props }: DocsPageProps): import("react").JSX.Element;
//#endregion
export { DocsBody, DocsDescription, DocsPage, DocsPageProps, DocsTitle, EditOnGitHub, Breadcrumb as PageBreadcrumb, PageLastUpdate, withArticle };