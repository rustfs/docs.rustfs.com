import { ReactNode } from "react";
import { ImageResponse } from "next/og.js";
import { ImageResponseOptions } from "next/dist/compiled/@vercel/og/types";
//#region src/og.d.ts
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
export { generate, generateOGImage };