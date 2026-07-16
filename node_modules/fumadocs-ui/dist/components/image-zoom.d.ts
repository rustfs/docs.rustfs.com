import { UncontrolledProps } from "../node_modules/.pnpm/react-medium-image-zoom@5.4.8_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/react-medium-image-zoom/dist/uncontrolled.js";
import "../node_modules/.pnpm/react-medium-image-zoom@5.4.8_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/react-medium-image-zoom/dist/index.js";
import { ImageProps } from "fumadocs-core/framework";
import { ComponentProps } from "react";
//#region src/components/image-zoom.d.ts
type ImageZoomProps = ImageProps & {
  /**
   * Image props when zoom in
   */
  zoomInProps?: ComponentProps<'img'>;
  /**
   * Props for `react-medium-image-zoom`
   */
  rmiz?: UncontrolledProps;
};
declare function ImageZoom({ zoomInProps, children, rmiz, ...props }: ImageZoomProps): import("react").JSX.Element;
//#endregion
export { ImageZoom, ImageZoomProps };