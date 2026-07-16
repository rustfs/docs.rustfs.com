import { Framework } from "./index.js";
import { ReactNode } from "react";
//#region src/framework/astro.d.ts
type AstroParams = Record<string, string | string[] | undefined>;
interface AstroProviderProps {
  children: ReactNode;
  pathname: string;
  params?: AstroParams;
  navigate?: (url: string) => void | Promise<void>;
  Link?: Framework['Link'];
  Image?: Framework['Image'];
}
/**
 * Fumadocs adapter for Astro with React islands.
 *
 * Pass `pathname` and `params` from `Astro.url.pathname` and `Astro.params`.
 * You can pass `navigate` from `astro:transitions/client` to preserve client navigation.
 */
declare function AstroProvider({ children, pathname, params, navigate, Link, Image }: AstroProviderProps): import("react").JSX.Element;
//#endregion
export { AstroProvider, AstroProviderProps };