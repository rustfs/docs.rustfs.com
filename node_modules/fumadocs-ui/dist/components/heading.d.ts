import { ComponentPropsWithoutRef } from "react";
//#region src/components/heading.d.ts
type Types = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
type HeadingProps<T extends Types> = Omit<ComponentPropsWithoutRef<T>, 'as'> & {
  as?: T;
};
declare function Heading<T extends Types = 'h1'>({ as, ...props }: HeadingProps<T>): import("react").JSX.Element;
//#endregion
export { Heading };