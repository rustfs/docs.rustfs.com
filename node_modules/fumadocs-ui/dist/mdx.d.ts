import { Callout, CalloutContainer, CalloutDescription, CalloutTitle } from "./components/callout.js";
import { Card, Cards } from "./components/card.js";
import { CodeBlockTab, CodeBlockTabs, CodeBlockTabsList, CodeBlockTabsTrigger } from "./components/codeblock.js";
import { createRelativeLink as createRelativeLink$1 } from "./mdx.server.js";
import React, { AnchorHTMLAttributes, FC, HTMLAttributes, ImgHTMLAttributes, TableHTMLAttributes } from "react";
//#region src/mdx.d.ts
/**
 * global types for MDX.js
 */
declare module 'mdx/types.js' {
  namespace JSX {
    type Element = React.JSX.Element;
    type ElementClass = React.JSX.ElementClass;
    type ElementType = React.JSX.ElementType;
    type IntrinsicElements = React.JSX.IntrinsicElements;
  }
}
declare function Image(props: ImgHTMLAttributes<HTMLImageElement>): React.JSX.Element;
declare function Table(props: TableHTMLAttributes<HTMLTableElement>): React.JSX.Element;
declare const defaultMdxComponents: {
  CodeBlockTab: typeof CodeBlockTab;
  CodeBlockTabs: typeof CodeBlockTabs;
  CodeBlockTabsList: typeof CodeBlockTabsList;
  CodeBlockTabsTrigger: typeof CodeBlockTabsTrigger;
  pre: (props: HTMLAttributes<HTMLPreElement>) => React.JSX.Element;
  Card: typeof Card;
  Cards: typeof Cards;
  a: FC<AnchorHTMLAttributes<HTMLAnchorElement>>;
  img: typeof Image;
  h1: (props: HTMLAttributes<HTMLHeadingElement>) => React.JSX.Element;
  h2: (props: HTMLAttributes<HTMLHeadingElement>) => React.JSX.Element;
  h3: (props: HTMLAttributes<HTMLHeadingElement>) => React.JSX.Element;
  h4: (props: HTMLAttributes<HTMLHeadingElement>) => React.JSX.Element;
  h5: (props: HTMLAttributes<HTMLHeadingElement>) => React.JSX.Element;
  h6: (props: HTMLAttributes<HTMLHeadingElement>) => React.JSX.Element;
  table: typeof Table;
  Callout: typeof Callout;
  CalloutContainer: typeof CalloutContainer;
  CalloutTitle: typeof CalloutTitle;
  CalloutDescription: typeof CalloutDescription;
};
declare const createRelativeLink: typeof createRelativeLink$1;
//#endregion
export { createRelativeLink, defaultMdxComponents as default };