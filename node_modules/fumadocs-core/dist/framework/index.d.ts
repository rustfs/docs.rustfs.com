import { ComponentProps, FC, ReactNode } from "react";
import { StaticImport } from "next/dist/shared/lib/get-img-props.js";
//#region src/framework/index.d.ts
interface ImageProps extends Omit<ComponentProps<'img'>, 'src'> {
  sizes?: string;
  /**
   * Next.js Image component has other allowed type for `src`
   */
  src?: string | StaticImport;
  /**
   * priority of image (from Next.js)
   */
  priority?: boolean;
}
interface LinkProps extends ComponentProps<'a'> {
  prefetch?: boolean;
}
interface Router {
  push: (url: string) => void | Promise<void>;
  refresh: () => void | Promise<void>;
}
interface Framework {
  usePathname: () => string;
  useParams: () => Record<string, string | string[]>;
  useRouter: () => Router;
  Link?: FC<ComponentProps<'a'> & {
    prefetch?: boolean;
  }>;
  Image?: FC<ImageProps>;
}
declare function FrameworkProvider({ Link, useRouter, useParams, usePathname, Image, children }: Framework & {
  children: ReactNode;
}): import("react").JSX.Element;
declare function usePathname(): string;
declare function useRouter(): Router;
declare function useParams(): Record<string, string | string[]>;
declare function Image(props: ImageProps): import("react").JSX.Element;
declare function Link(props: LinkProps): import("react").JSX.Element;
//#endregion
export { Framework, FrameworkProvider, Image, ImageProps, Link, Router, useParams, usePathname, useRouter };