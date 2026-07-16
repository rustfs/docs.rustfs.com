import { Framework } from "./index.js";
import { ReactNode } from "react";
//#region src/framework/react-router.d.ts
declare function ReactRouterProvider({ children, Link: CustomLink, Image: CustomImage }: {
  children: ReactNode;
  Link?: Framework['Link'];
  Image?: Framework['Image'];
}): import("react").JSX.Element;
//#endregion
export { ReactRouterProvider };