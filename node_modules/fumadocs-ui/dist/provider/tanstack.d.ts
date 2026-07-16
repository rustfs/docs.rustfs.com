import { RootProvider as RootProvider$1 } from "./base.js";
import { Framework } from "fumadocs-core/framework";
import { ComponentProps } from "react";
//#region src/provider/tanstack.d.ts
interface RootProviderProps extends ComponentProps<typeof RootProvider$1> {
  /**
   * Custom framework components to override Tanstack Router defaults
   */
  components?: {
    Link?: Framework['Link'];
    Image?: Framework['Image'];
  };
}
declare function RootProvider({ components, ...props }: RootProviderProps): import("react").JSX.Element;
//#endregion
export { RootProvider, RootProviderProps };