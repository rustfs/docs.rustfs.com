import { Framework } from "./index.js";
import { ReactNode } from "react";
//#region src/framework/tanstack.d.ts
/**
 * Fumadocs adapter for Tanstack Router/Start
 */
declare function TanstackProvider({ children, Link: CustomLink, Image: CustomImage }: {
  children: ReactNode;
  Link?: Framework['Link'];
  Image?: Framework['Image'];
}): import("react").JSX.Element;
//#endregion
export { TanstackProvider };