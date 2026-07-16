import { S as LoaderPlugin } from "../../index-DmFlQQrd2.js";
import { icons } from "lucide-react";
//#region src/source/plugins/lucide-icons.d.ts
/**
 * Convert icon names into Lucide Icons, requires `lucide-react` to be installed.
 */
declare function lucideIconsPlugin(options?: {
  defaultIcon?: keyof typeof icons;
}): LoaderPlugin;
//#endregion
export { lucideIconsPlugin };