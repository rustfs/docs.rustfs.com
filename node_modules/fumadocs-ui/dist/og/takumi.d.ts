import { ReactNode } from "react";
import { ImageResponse, ImageResponseOptions } from "takumi-js/response";
//#region src/og/takumi.d.ts
interface GenerateProps {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  primaryColor?: string;
  primaryTextColor?: string;
  site?: ReactNode;
}
declare function generateOGImage(options: GenerateProps & ImageResponseOptions): ImageResponse;
declare function generate({ primaryColor, primaryTextColor, icon, ...props }: GenerateProps): import("react").JSX.Element;
//#endregion
export { GenerateProps, generate, generateOGImage };