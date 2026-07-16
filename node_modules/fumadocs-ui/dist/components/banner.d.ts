import { HTMLAttributes } from "react";
//#region src/components/banner.d.ts
type BannerVariant = 'rainbow' | 'normal';
declare function Banner({ id, variant, changeLayout, height, rainbowColors, ...props }: HTMLAttributes<HTMLDivElement> & {
  /**
   * @defaultValue 3rem
   */
  height?: string;
  /**
   * @defaultValue 'normal'
   */
  variant?: BannerVariant;
  /**
   * For rainbow variant only, customize the colors
   */
  rainbowColors?: string[];
  /**
   * Change Fumadocs layout styles
   *
   * @defaultValue true
   */
  changeLayout?: boolean;
}): import("react").JSX.Element | null;
//#endregion
export { Banner };