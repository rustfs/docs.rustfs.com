import { RootProvider as RootProvider$1 } from "./base.js";
import { Framework } from "fumadocs-core/framework";
import { ComponentProps } from "react";
import { AstroProviderProps } from "fumadocs-core/framework/astro";
//#region src/provider/astro.d.ts
interface RootProviderProps extends ComponentProps<typeof RootProvider$1> {
  /**
   * The current Astro pathname, usually `Astro.url.pathname`.
   */
  pathname: AstroProviderProps['pathname'];
  /**
   * The current Astro route params, usually `Astro.params`.
   */
  params?: AstroProviderProps['params'];
  /**
   * Optional Astro client navigation function from `astro:transitions/client`.
   */
  navigate?: AstroProviderProps['navigate'];
  /**
   * Custom framework components to override Astro defaults
   */
  components?: {
    Link?: Framework['Link'];
    Image?: Framework['Image'];
  };
}
declare function RootProvider({ components, pathname, params, navigate, ...props }: RootProviderProps): import("react").JSX.Element;
//#endregion
export { RootProvider, RootProviderProps };