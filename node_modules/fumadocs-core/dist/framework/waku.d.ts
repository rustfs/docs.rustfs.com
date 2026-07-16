import { Framework } from "./index.js";
import { ReactNode } from "react";
//#region src/framework/waku.d.ts
declare function WakuProvider({ children, Link: CustomLink, Image: CustomImage }: {
  children: ReactNode;
  Link?: Framework['Link'];
  Image?: Framework['Image'];
}): import("react").JSX.Element;
//#endregion
export { WakuProvider };